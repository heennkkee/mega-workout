const sqlite = require("sqlite3").verbose();

module.exports = new RyggbiffsData();

function RyggbiffsData() {

    //Settings
    this.path = './data/data.sqlite';
    var db = new sqlite.Database(this.path);
    db.exec('PRAGMA foreign_keys = ON');

    var Query = "test";
    var Data = null;
    var dataIsSet = false;
    var Params = {};

    this.isDataSet = function() {
        return dataIsSet;
    }

    this.setDbMode = function(mode) {
        if (mode === 'parallel') {
            db.parallelize();
        } else if (mode === 'serialize') {
            db.serialize();
        } else {
            throw "Invalid mode: " + mode;
        }
    }

    this.query = function(input) {
        Query = input;
    }

    this.clearParams = function() {
        Params = {};
    }

    this.setParam = function(key, value) {
        Params[key] = value;
    }

    this.removeParam = function(key) {
        delete Params[key];
    }

    this.execute = function(callback) {
        if (Object.keys(Params).length > 0) {
            db.run(Query, Params, function(err) {
                if (err !== null) {
                    console.log(err);
                }
                if (typeof callback === "function") {
                    callback();
                }
            });
        } else {
            db.run(Query, function(err) {
                if (err !== null) {
                    console.log(err);
                }
                if (typeof callback === "function") {
                    callback();
                }
            });
        }
    }

    this.fetch = function(callback) {
        dataIsSet = false;
        if (Object.keys(Params).length > 0) {
            db.all(Query, Params, function(err, rows) {
                if (err !== null) {
                    console.log("error", err);
                } else {
                    Data = rows;
                    if (rows.length !== 0) {
                        dataIsSet = true;
                    }
                }
                if (typeof callback === "function") {
                    callback();
                }
            });
        } else {
            db.all(Query, function(err, rows) {
                if (err !== null) {
                    console.log("error", err);
                } else {
                    Data = rows;
                    if (rows.length !== 0) {
                        dataIsSet = true;
                    }
                }
                if (typeof callback === "function") {
                    callback();
                }
            });
        }
    }

    this.seeData = function() {
        console.log(Data);
        return Data;
    }

    this.MDLTableHeaders = function (columns) {
        var headers, returnHeaders, value, x;

        if (!dataIsSet) {
            console.log("Data isn't set, unable to retrieve headers!");
            return "No data to return";
        }

        headers = Object.keys(Data[0]);

        returnHeaders = '<tr>';
        if (columns.length === 0) {
            for (x = 0; x < headers.length; x += 1) {
                if (headers[x] === 'ID') {
                    continue;
                }
                returnHeaders += '<th>' + headers[x] + '</th>'
            }
        } else {
            for (x = 0; x < columns.length; x += 1) {
                if (headers[x] === 'ID') {
                    continue;
                }
                returnHeaders += '<th>' + headers[columns[x]] + '</th>';
            }
        }
        returnHeaders += '</tr>';
        return returnHeaders;

    }

    this.MDLTableRows = function(columns) {
        var rows = '', x, y, headers, thisRow, dataType, value, id, header, onclick;
        if (!dataIsSet) {
            console.log("Data isn't set, unable to retrieve rows!");
            return "No data to return";
        }

        headers = Object.keys(Data[0]);

        if (columns.length === 0) {
            columns = headers;
        }

        for (x = 0; x < Data.length; x += 1) {
            thisRow = '';
            onclick = '';
            for (y = 0; y < columns.length; y += 1) {
                if (typeof columns[y] === "number") {
                    header = headers[columns[y]];
                } else {
                    header = columns[y];
                }
                value = Data[x][header];

                if (header.toUpperCase() === "ID") {
                    onclick = 'onclick="editLink(' + value + ')"';
                } else {
                    if (typeof value !== "number") {
                        dataType = 'class="mdl-data-table__cell--non-numeric "'
                    }
                    thisRow += '<td ' + dataType + '>' + value + '</td>'
                }

                dataType = '';
            }
            rows += '<tr ' + onclick + '>' + thisRow + '</tr>';
        }
        return rows;
    }

    this.setup = function() {

        db.serialize(function () {

            db.run('CREATE TABLE IF NOT EXISTS "PERSONER" ("ID" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE ON CONFLICT IGNORE , "NAMN" VARCHAR NOT NULL  UNIQUE ON CONFLICT IGNORE, "AKTIV" INTEGER DEFAULT 1, "MAIL" VARCHAR UNIQUE ON CONFLICT IGNORE)');
            db.run('INSERT INTO PERSONER (NAMN, MAIL) VALUES("Henrik", "henrik.aronsson.94@gmail.com")');

            db.run('CREATE TABLE IF NOT EXISTS "PASS" ("ID" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE ON CONFLICT IGNORE , "NAMN" VARCHAR NOT NULL  UNIQUE ON CONFLICT IGNORE)');
            db.run('INSERT INTO PASS (NAMN) VALUES("Bröst och axlar")');

            db.run('CREATE TABLE IF NOT EXISTS "OVNINGAR" ("ID" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE ON CONFLICT IGNORE , "NAMN" VARCHAR NOT NULL  UNIQUE ON CONFLICT IGNORE )');
            db.run('INSERT INTO OVNINGAR (NAMN) VALUES("Marklyft")');
            db.run('INSERT INTO OVNINGAR (NAMN) VALUES("Bänkpress")');
            db.run('INSERT INTO OVNINGAR (NAMN) VALUES("Militärpress")');

            db.run('CREATE TABLE IF NOT EXISTS "PASS_OVNINGAR" ("ID" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE ON CONFLICT IGNORE, "PASS_ID" INTEGER NOT NULL, "OVNING_ID" INTEGER NOT NULL, FOREIGN KEY("PASS_ID") REFERENCES PASS(ID), FOREIGN KEY("OVNING_ID") REFERENCES OVNINGAR(ID), UNIQUE ("PASS_ID", "OVNING_ID") ON CONFLICT IGNORE)');
            db.run('INSERT INTO PASS_OVNINGAR(PASS_ID, OVNING_ID) VALUES(1, 2)');
            db.run('INSERT INTO PASS_OVNINGAR(PASS_ID, OVNING_ID) VALUES(1, 3)');

            db.run('CREATE TABLE IF NOT EXISTS "HISTORIK" ("ID" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "VIKT" DOUBLE NOT NULL , "ANTAL" INTEGER NOT NULL, "PERSON_ID" INTEGER NOT NULL, "OVNING_ID" INTEGER NOT NULL, "DATUM" DATETIME, FOREIGN KEY("PERSON_ID") REFERENCES PERSONER(ID), FOREIGN KEY("OVNING_ID") REFERENCES OVNINGAR(ID))');

            db.run('CREATE TABLE IF NOT EXISTS "LOGINS" ("ID" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "MAIL" VARCHAR NOT NULL , "HASH" VARCHAR NOT NULL )');

            db.run('CREATE TABLE IF NOT EXISTS "WHITELIST" ("ID" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "MAIL" VARCHAR NOT NULL  UNIQUE ON CONFLICT IGNORE, "LASTMAIL" DATETIME, "UNUSED_CODES" INTEGER DEFAULT 0)');
            db.run('INSERT INTO WHITELIST(MAIL) VALUES("henrik.aronsson.94@gmail.com")');
            db.run('INSERT INTO WHITELIST(MAIL) VALUES("karlmagnus.karlsson@hotmail.com")');
            db.run('INSERT INTO WHITELIST(MAIL) VALUES("magnus.kjellin@hotmail.se")');

            db.run('CREATE VIEW IF NOT EXISTS "HISTORIK_VIEW" AS  SELECT p.NAMN AS "PERSON", o.NAMN AS "OVNING", h.VIKT, h.ANTAL, h.DATUM FROM HISTORIK h JOIN PERSONER p ON h.PERSON_ID = p.ID JOIN OVNINGAR o ON h.OVNING_ID = o.ID');
            db.run('CREATE VIEW IF NOT EXISTS "PASS_VIEW" AS  SELECT p.ID, p.NAMN, GROUP_CONCAT(o.NAMN) AS "OVNINGAR" FROM PASS_OVNINGAR po JOIN PASS p ON po.PASS_ID = p.ID JOIN OVNINGAR o ON po.OVNING_ID = o.ID GROUP BY p.NAMN', function () {
                console.log("tables created.");
            })
        });
    }
}

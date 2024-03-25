/*
==============================================
QUALITY OF LIFE - SHORT REPORT CONTROLLER
----------------------------------------------
Methods:
- Personalized Neighbours
==============================================
*/

const mongoose = require("mongoose");
const fs = require("fs");
const NodeRSA = require("node-rsa");

const User = require("../models/user");
const Collection = require("../models/collection");
const MemberCollection = require("../models/memberCollection");

const config = require("../config/config");
const { reports } = require("../config/logging");
const log = reports;

const userFunctions = require("../utils/userFunctions");
const neighbourFunctions = require("../utils/neighboursFunctions");
const { error } = require("joi/lib/types/lazy");
const { errors } = require("joi/lib/language");
const memberCollection = require("../models/memberCollection");

// ====================================================
// Encryption routes for keys and extracting keys
// ====================================================

let key_private = new NodeRSA();
let key_public = new NodeRSA();

var public = fs.readFileSync("./Keys/public.pem", "utf8");
var private = fs.readFileSync("./Keys/private.pem", "utf8");

key_private.importKey(private);
key_public.importKey(public);

// ======================================================
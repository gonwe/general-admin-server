/**
 * 用户ID维护表集合
 */
const mongoose = require("mongoose");
const counterSchema = mongoose.Schema({
  _id: String, //名称
  sequence_value: Number,
});
// 1，集合名称，2，对象名称，3，数据库名称
module.exports = mongoose.model("counter", counterSchema, "counters");

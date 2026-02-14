// MIT许可证
// 版权所有 (c) 2025 AskingAcake
//
// 特此免费授予任何获得本软件及相关文档文件（“软件”）副本的人
// 不受限制地处理本软件的权利，包括但不限于使用、复制、修改、合并、
// 发布、分发、再许可和/或销售本软件的副本，并允许向其提供本软件的人
// 这样做，但须符合以下条件：
//
// 上述版权声明和本许可声明应包含在本软件的所有副本或主要部分中。
//
// 本软件“按原样”提供，不附带任何形式的明示或暗示保证，包括但不限于
// 对适销性、特定用途适用性和非侵权性的保证。在任何情况下，
// 作者或版权持有人均不对因本软件或使用本软件引起的任何索赔、损害或其他
// 责任负责，无论是在合同诉讼、侵权行为还是其他方面，即使已被告知可能发生此类损害。

// 由 AskingAcake 制作，SimpleBrain 扩展

(function (Scratch) {
'use strict';

const 代理集合 = {};

class 思维代理 {
constructor(名称) {
this.名称 = 名称;
this.记忆 = {};
this.规则列表 = [];
this.上次结果 = "空闲";
this.模式 = "权重"; // 默认大脑模式
}

思考() {
const 匹配规则 = [];

for (const 规则 of this.规则列表) {
try {
const 值 = this.记忆[规则.键];
const 条件值 = SimpleBrain._解析(规则.值);
let 通过 = false;

switch (规则.操作符) {
case '=': 通过 = 值 == 条件值; break;
case '>': 通过 = Number(值) > Number(条件值); break;
case '<': 通过 = Number(值) < Number(条件值); break;
case '包含':
通过 = Array.isArray(值) && 值.includes(条件值);
break;
}

if (通过) {
let 数量 = this.模式 === "权重"
? Math.round(规则.权重)
: Math.round((规则.权重 / 100) * 100); // 将百分比转换为数量
for (let i = 0; i < 数量; i++) {
匹配规则.push(规则.结果);
}
}
} catch {}
}

if (匹配规则.length === 0) {
this.上次结果 = "空闲";
return "空闲";
}

const 选择 = 匹配规则[Math.floor(Math.random() * 匹配规则.length)];
this.上次结果 = 选择;
return 选择;
}

学习(结果) {
for (const [键, 值] of Object.entries(this.记忆)) {
const 操作符 = typeof 值 === 'number' ? '>' : '=';
this.规则列表.push({
键: 键,
操作符: 操作符,
值: 值,
结果: 结果,
权重: this.模式 === "权重" ? 1 : 1 // 目前简化处理
});
}
}
}

class SimpleBrain {
getInfo() {
return {
id: 'askingacakesimplebrain',
name: '简易大脑',
color1: '#4B0082',
blocks: [
{
opcode: '创建代理',
blockType: Scratch.BlockType.COMMAND,
text: '创建简易大脑AI命名为[名称]',
arguments: {
名称: { type: Scratch.ArgumentType.STRING, defaultValue: '机器人1' }
}
},
{
opcode: '设置记忆',
blockType: Scratch.BlockType.COMMAND,
text: '将[名称]的记忆[键]设置为[值]',
arguments: {
名称: { type: Scratch.ArgumentType.STRING, defaultValue: '机器人1' },
键: { type: Scratch.ArgumentType.STRING, defaultValue: '心情' },
值: { type: Scratch.ArgumentType.STRING, defaultValue: '开心' }
}
},
{
opcode: '添加带权重的记忆',
blockType: Scratch.BlockType.COMMAND,
text: '为[名称]添加记忆[键]:[值] 权重为[权重]',
arguments: {
名称: { type: Scratch.ArgumentType.STRING, defaultValue: '机器人1' },
键: { type: Scratch.ArgumentType.STRING, defaultValue: '心情' },
值: { type: Scratch.ArgumentType.STRING, defaultValue: '开心' },
权重: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
}
},
{
opcode: '添加带百分比的记忆',
blockType: Scratch.BlockType.COMMAND,
text: '为[名称]添加记忆[键]:[值] 百分比为[百分比]%',
arguments: {
名称: { type: Scratch.ArgumentType.STRING, defaultValue: '机器人1' },
键: { type: Scratch.ArgumentType.STRING, defaultValue: '心情' },
值: { type: Scratch.ArgumentType.STRING, defaultValue: '开心' },
百分比: { type: Scratch.ArgumentType.NUMBER, defaultValue: 25 }
}
},
{
opcode: '设置大脑类型',
blockType: Scratch.BlockType.COMMAND,
text: '将[名称]的大脑类型设置为[类型]',
arguments: {
名称: { type: Scratch.ArgumentType.STRING, defaultValue: '机器人1' },
类型: {
type: Scratch.ArgumentType.STRING,
menu: '大脑类型',
defaultValue: '权重'
}
}
},
{
opcode: '设置结果权重',
blockType: Scratch.BlockType.COMMAND,
text: '将[名称]中[结果]的权重设置为[权重]',
arguments: {
名称: { type: Scratch.ArgumentType.STRING, defaultValue: '机器人1' },
结果: { type: Scratch.ArgumentType.STRING, defaultValue: '跳舞' },
权重: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
}
},
{
opcode: '设置结果百分比',
blockType: Scratch.BlockType.COMMAND,
text: '将[名称]中[结果]的百分比设置为[百分比]%',
arguments: {
名称: { type: Scratch.ArgumentType.STRING, defaultValue: '机器人1' },
结果: { type: Scratch.ArgumentType.STRING, defaultValue: '跳舞' },
百分比: { type: Scratch.ArgumentType.NUMBER, defaultValue: 25 }
}
},
{
opcode: '获取记忆',
blockType: Scratch.BlockType.REPORTER,
text: '获取[名称]的记忆[键]',
arguments: {
名称: { type: Scratch.ArgumentType.STRING, defaultValue: '机器人1' },
键: { type: Scratch.ArgumentType.STRING, defaultValue: '心情' }
}
},
{
opcode: '是否有记忆',
blockType: Scratch.BlockType.BOOLEAN,
text: '[名称]有记忆[键]吗？',
arguments: {
名称: { type: Scratch.ArgumentType.STRING, defaultValue: '机器人1' },
键: { type: Scratch.ArgumentType.STRING, defaultValue: '心情' }
}
},
{
opcode: '添加规则',
blockType: Scratch.BlockType.COMMAND,
text: '为[名称]添加规则：如果记忆[键] [运算符] [值] 那么[结果] 权重为[权重]',
arguments: {
名称: { type: Scratch.ArgumentType.STRING, defaultValue: '机器人1' },
键: { type: Scratch.ArgumentType.STRING, defaultValue: '心情' },
运算符: {
type: Scratch.ArgumentType.STRING,
menu: '运算符',
defaultValue: '='
},
值: { type: Scratch.ArgumentType.STRING, defaultValue: '开心' },
结果: { type: Scratch.ArgumentType.STRING, defaultValue: '跳舞' },
权重: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
}
},
{
opcode: '清空规则',
blockType: Scratch.BlockType.COMMAND,
text: '清空[名称]的规则',
arguments: {
名称: { type: Scratch.ArgumentType.STRING, defaultValue: '机器人1' }
}
},
{
opcode: '运行逻辑',
blockType: Scratch.BlockType.REPORTER,
text: '运行[名称]的逻辑',
arguments: {
名称: { type: Scratch.ArgumentType.STRING, defaultValue: '机器人1' }
}
},
{
opcode: '获取上次结果',
blockType: Scratch.BlockType.REPORTER,
text: '获取[名称]的上次结果',
arguments: {
名称: { type: Scratch.ArgumentType.STRING, defaultValue: '机器人1' }
}
},
{
opcode: '学习规则',
blockType: Scratch.BlockType.COMMAND,
text: '为[名称]从记忆和结果[结果]学习规则',
arguments: {
名称: { type: Scratch.ArgumentType.STRING, defaultValue: '机器人1' },
结果: { type: Scratch.ArgumentType.STRING, defaultValue: '哭泣' }
}
}
],
menus: {
运算符: {
acceptReporters: false,
items: ['=', '>', '<', '包含']
},
大脑类型: {
acceptReporters: false,
items: ['权重', '百分比']
}
}
};
}

// === 新大脑类型函数 ===
设置大脑类型(参数) {
const 代理 = 代理集合[参数.名称];
if (!代理) return;
代理.模式 = 参数.类型;
}

添加带权重的记忆(参数) {
const 代理 = 代理集合[参数.名称];
if (!代理 || 代理.模式 !== '权重') return '错误：大脑正在使用' + 代理?.模式;
代理.记忆[参数.键] = 参数.值;
代理.规则列表.push({
键: 参数.键,
操作符: '=',
值: 参数.值,
结果: 参数.值,
权重: Number(参数.权重)
});
}

添加带百分比的记忆(参数) {
const 代理 = 代理集合[参数.名称];
if (!代理 || 代理.模式 !== '百分比') return '错误：大脑正在使用' + 代理?.模式;
代理.记忆[参数.键] = 参数.值;
代理.规则列表.push({
键: 参数.键,
操作符: '=',
值: 参数.值,
结果: 参数.值,
权重: Number(参数.百分比)
});
}

设置结果权重(参数) {
const 代理 = 代理集合[参数.名称];
if (!代理 || 代理.模式 !== '权重') return '错误：大脑正在使用' + 代理?.模式;
for (const 规则 of 代理.规则列表) {
if (规则.结果 === 参数.结果) 规则.权重 = Number(参数.权重);
}
}

设置结果百分比(参数) {
const 代理 = 代理集合[参数.名称];
if (!代理 || 代理.模式 !== '百分比') return '错误：大脑正在使用' + 代理?.模式;
for (const 规则 of 代理.规则列表) {
if (规则.结果 === 参数.结果) 规则.权重 = Number(参数.百分比);
}
}

// === 现有逻辑 ===
创建代理(参数) {
代理集合[参数.名称] = new 思维代理(参数.名称);
}
设置记忆(参数) {
const 代理 = 代理集合[参数.名称];
if (!代理) return;
代理.记忆[参数.键] = SimpleBrain._解析(参数.值);
}
获取记忆(参数) {
const 代理 = 代理集合[参数.名称];
if (!代理) return '错误';
return 代理.记忆[参数.键] ?? '未定义';
}
是否有记忆(参数) {
const 代理 = 代理集合[参数.名称];
if (!代理) return false;
return Object.hasOwn(代理.记忆, 参数.键);
}
添加规则(参数) {
const 代理 = 代理集合[参数.名称];
if (!代理) return;
代理.规则列表.push({
键: 参数.键,
操作符: 参数.运算符,
值: 参数.值,
结果: 参数.结果,
权重: Number(参数.权重)
});
}
清空规则(参数) {
const 代理 = 代理集合[参数.名称];
if (!代理) return;
代理.规则列表 = [];
}
运行逻辑(参数) {
const 代理 = 代理集合[参数.名称];
if (!代理) return "错误";
return 代理.思考();
}
获取上次结果(参数) {
const 代理 = 代理集合[参数.名称];
if (!代理) return "错误";
return 代理.上次结果;
}
学习规则(参数) {
const 代理 = 代理集合[参数.名称];
if (!代理) return;
代理.学习(参数.结果);
}

static _解析(值) {
try {
const 数字 = Number(值);
return isNaN(数字) ? 值 : 数字;
} catch {
return 值;
}
}
}

Scratch.extensions.register(new SimpleBrain());
})(Scratch);

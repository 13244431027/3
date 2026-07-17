// ==UserScript==
// @name         ccw伪装身份
// @version      1.0.3
// @description  在ccw伪装身份
// @match        https://*.ccw.site/*
// @author       不想上学
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-start
// ==/UserScript==
(function () {
	"use strict";
	function getCookie(name) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(";").shift();
	}
	function setCookie(name, value) {
		document.cookie = `${name}=${value}; path=/;`;
	}
	function patch(obj, p, fn) {
		if (obj[p]) obj[p] = fn(obj[p]);
	}
	async function change() {
		const oid = prompt(
			"输入目标用户的oid（主页链接后面的部分），取消代表不伪装",
			GM_getValue("伪装的身份", {}).oid ?? ""
		);
		if (oid) {
			const info = await fetch(
				"https://community-web.ccw.site/students/profile",
				{
					headers: {
						"content-type": "application/json"
					},
					referrer: "https://www.ccw.site/",
					method: "POST",
					body: JSON.stringify({
						studentOid: oid
					})
				}
			).then(r => r.json());
			let id, name, avatar;
			if (info.body?.studentNumber) {
				id = prompt(
					"输入要伪装的id，取消代表自动获取",
					GM_getValue("伪装的身份", {}).id ?? ""
				);
				if (id === null) id = info.body?.studentNumber;
			} else
				id = prompt(
					"输入要伪装的id",
					GM_getValue("伪装的身份", {}).id ?? ""
				);
			if (info.body?.name) {
				name = prompt(
					"输入要伪装的名字，取消代表自动获取",
					GM_getValue("伪装的身份", {}).name ?? ""
				);
				if (name === null) name = info.body?.name;
			} else
				name = prompt(
					"输入要伪装的名字",
					GM_getValue("伪装的身份", {}).name ?? ""
				);
			if (info.body?.avatar) {
				avatar = prompt(
					"输入要伪装的头像url，取消代表自动获取",
					GM_getValue("伪装的身份", {}).avatar ?? ""
				);
				if (avatar === null) avatar = info.body?.avatar;
			} else
				avatar = prompt(
					"输入要伪装的头像url",
					GM_getValue("伪装的身份", {}).avatar ?? ""
				);
			if (id === null || name === null || avatar === null) return null;
			GM_setValue("伪装的身份", {
				oid,
				id,
				name,
				avatar
			});
		} else {
			GM_deleteValue("伪装的身份");
		}
		if (oid && !getCookie("cookie-user-id")) {
			setCookie("cookie-user-id", oid);
		}
		unsafeWindow.location.reload(true);
	}
	const XHR = XMLHttpRequest.prototype;
	if (GM_getValue("伪装的身份")) {
		const { oid, id } = GM_getValue("伪装的身份");
		GM_registerMenuCommand(`伪装身份（id${id}）`, change);
	} else {
		GM_registerMenuCommand("伪装身份（未开启）", change);
	}
	patch(
		XHR,
		"open",
		_open =>
			function (method, url) {
				if (GM_getValue("伪装的身份")) {
					if (
						url ==
						"https://community-web.ccw.site/students/self/detail"
					) {
						const { name, oid, id, avatar } =
							GM_getValue("伪装的身份");
						return _open.call(
							this,
							method,
							"data:application/json," +
								JSON.stringify({
									body: {
										abGroup: null,
										accountNumber: null,
										address: null,
										addressCode: null,
										age: null,
										archive: null,
										avatar,
										bio: "",
										birthYear: null,
										birthday: null,
										category: null,
										city: null,
										commentCount: 0,
										contactPhone: 12345678901,
										countryCode: null,
										createdAt: Date.now(),
										currentMajorClazzOid: null,
										currentParent: {
											bindPhone: "12345678901",
											qqNickname: "不想上学",
											qqNum: null
										},
										distinctId: null,
										district: null,
										email: null,
										energy: null,
										energyRegain: null,
										examScore: null,
										extraInfo: null,
										firstTime: null,
										followingStatus: null,
										fullName: "创作者",
										gender: null,
										grade: 0,
										group: null,
										guest: null,
										guestNumber: null,
										hideGender: false,
										host: "aliyun",
										identity: null,
										identityAuthRank: "L2",
										identityType: null,
										informationModifyDate: {
											avatarModifiedAt: null,
											nameModifiedAt: null
										},
										keywords: [],
										lastLoginAt: null,
										lastStudyAt: null,
										lowAge: null,
										midexamScore: null,
										miniprojectFreeNum: null,
										mpClicked: null,
										mpShowedModal: null,
										mpTutorial: null,
										name,
										newWorkbenchTutorial: null,
										oid,
										orgId: null,
										parents: [
											{
												acceptedCashInviteOnce: null,
												alphaUser: null,
												altName: null,
												annualIncome: null,
												archive: null,
												authedTime: null,
												avatar: null,
												bindPhone: "90240334147",
												birthday: null,
												cashInviteCreatedAt: null,
												cashInviteRestartAt: null,
												clazzDevice: null,
												company: null,
												countryCode: null,
												createdAt: null,
												degree: null,
												distinctId:
													"CD7C6B6226784144970A0EDDAE9F4070",
												divorced: null,
												email: null,
												ext: {},
												followTeachers: [],
												fullName: null,
												gender: null,
												giftCardCampaign: null,
												guestOid: null,
												idcard: null,
												industry: null,
												integer: null,
												inviterableId: null,
												inviterableType: null,
												isEmployee: null,
												jobPosition: null,
												lastSubscribeAt: null,
												mainContact: null,
												name: null,
												needSelectClazz: null,
												oid,
												overseaExperience: null,
												phoneAddr: {
													phone: "12345678901"
												},
												powerUser: null,
												realName: null,
												relationship: null,
												remarkName: null,
												rewardsCashesCount: null,
												source: null,
												sourceCategory: null,
												sourceInfo: null,
												status: null,
												student: null,
												studentOid: oid,
												subscribe: null,
												subscribeScene: null,
												tags: null,
												telephone: "90240334147",
												university: null,
												updatedAt: null,
												userTags: [],
												userType: null,
												wechatAccount: null,
												wechatCity: null,
												wechatCountry: null,
												wechatOpenid: null,
												wechatProvince: null,
												wechatUnionid: null,
												wehubWxid: null,
												wxid: null
											}
										],
										passwordDigest: null,
										photo: null,
										picUrl: null,
										province: null,
										qq: null,
										receiver: null,
										regChannel: "1",
										remarkName: null,
										reputationScore: {
											rank: "EXCELLENT",
											score: 100,
											studentOid: null
										},
										role: null,
										school: null,
										showServiceTerm: null,
										showTaskList: null,
										stats: null,
										studentNumber: id,
										task: null,
										teacherUnreadedMessages: null,
										tutorialSteps: null,
										updatedAt: Date.now(),
										validateSchool: null,
										virtualValue: null,
										watchedMiniProjectTutorailVideo: null,
										xiguaStudentNo: null
									},
									code: "200",
									msg: null,
									status: 200
								})
						);
					}
				}
				return _open.call(this, ...arguments);
			}
	);
})();

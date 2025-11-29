(function () {
  'use strict';

  // #region --------------- START: src/dollyPro/l10n.js --------------- 

  const l10n$1 = {
    'zh-cn': {
      name: '多莉Pro',
      urlButton: '📖 扩展教程',
      url: 'https://learn.ccw.site/article/9b9b43cd-75c3-4271-998c-b7c250fc81b9',
      'tag.utils': '🔧 常用工具',
      'tag.event': '🔔 事件相关',
      'tag.cloneAndDelete': '🪄 克隆与删除',
      'tag.data': '📄 数据获取与设置',
      'tag.group': '🏷️ 克隆体标签',
      'tag.motion': '🚶 运动相关',
      'tag.sensing': '🔍 侦测相关',
      'tag.test': '🚧 实验积木',
      'menu.targetType.IDlist': 'ID列表',

      'block.removeAllTags': '移除[ID]的所有标签',
      'stage': '舞台',
      'warn.newIDIsOldID': '修改的角色ID已经是 "%s"!',
      'warn.repetitveID': '已存在ID为 "%s"的克隆体或角色，请不要设置相同 ID！',
      'error.repetitiveID': '你克隆了多个ID均为 "%s" 的克隆体，克隆时请勿使用相同ID！',
      'config.tip':
        '该注释用于保存多莉Pro扩展信息\n你可以拖动/缩放这个注释。不建议直接编辑注释文字。可以删除这个注释来清除扩展配置信息',

      'button.showBlock': '💡 显示不常用的多莉积木',
      'button.hideBlock': '隐藏不常用的多莉积木',
      'confirm.showBlock?': '为了避免积木过多，一些不常用的多莉积木被隐藏了起来\n是否显示隐藏积木？',
      'block.addOrRemoveIDFromGroup': '为[ID][OP][GROUP]标签',
      'block.pickTarget': '点x:[X]y:[Y]处最上层克隆体ID',
      'block.addOrRemoveMyselfFromGroup': '为我[OP]标签[GROUP]',
      'block.calcDistanceBetweenClones': 'ID[ID1]到ID[ID2]的[MENU]',
      'block.infoBetweenCloneAndPoint': 'ID[ID]到x:[X]y:[Y]的[MENU]',
      'block.calcDistanceToClone': '到ID[ID]的[MENU]',
      'block.cancelAccessTransfer': '取消坐标/方向数据的访问转移',
      'block.cloneIDOfForEach': '⚠️当前遍历ID',
      'block.createCloneAndSpecifyID': '克隆[TARGET]并设置ID[ID]',
      'block.createCloneAndSpecifyTag': '克隆[TARGET]并设置标签[TAG]',
      'block.createCloneAndSpecifyData': '克隆[TARGET]并设置数据[KEY]=[VALUE]',
      'block.deleteCloneByID': '删除克隆体[ID]',
      'block.dispatchWhenCloneDeleted': '当侦测到有 [TARGET] 的克隆体被删除。删除的克隆体ID = [ID]',
      'block.dispatchWhenCloned': '当侦测到有 [TARGET] 的克隆体产生。产生的克隆体ID = [ID]',
      'block.forEachWithGroup': '⚠️遍历所有带标签[GROUP]的克隆体',
      'block.getClonePropertyInGroup': '带标签[GROUP]的第[INDEX]个[PROPERTY]',
      'block.getClonePropertyWithID': 'ID[ID]的 [PROPERTY]',
      'block.getCloneTargetPropertyWithSpriteName': '[TARGET] 克隆体的 [PROPERTY]',
      'block.getGroupInfo': '带标签[GROUP]的[PROPERTY]',
      'block.getJustCreatedCloneID': '刚克隆的ID',
      'block.myID': '我的ID',
      'block.mySpriteName': '我的角色名',
      'block.mySpriteID': '所属角色ID',
      'block.spriteID': '[TARGET]的ID',
      'block.tagID': '标签[TAG]的ID',
      'tooltip.tagID': '获取带有指定标签的克隆体的ID，如果有多个克隆体则只返回其中一个。',
      'block.getMyProperty': '我的 [PROPERTY]',
      'block.getMyValueByKey': '我的[KEY]',
      'block.getNearestClone': '离我[TYPE][MENU][VALUE]',
      'block.getNearestForID': '离[ID][TYPE][MENU][VALUE]',
      'block.getNearestSpriteClone': '离我[TYPE]的[SPRITE]的ID',
      'block.getNearestTagClone': '离我[TYPE]标签[TAG]的ID',
      'menu.nearest': '最近的',
      'menu.farthest': '最远的',
      'block.getOriginalTargetPropertyWithSpriteName': ' [TARGET] 的 [PROPERTY]',
      'block.getTouchingID': '我碰到的[MENU][VALUE]的[TYPE]ID',
      'block.getTouchingSpriteID': '我碰到的[SPRITE]的[TYPE]ID',
      'block.getTouchingTagID': '我碰到的标签[TAG]的[TYPE]ID',
      'block.getValueOfCloneIDWithKey': 'ID[ID]的[KEY]',
      'block.getPrivateVarOfClone': 'ID[ID]的变量[VAR]',
      'block.ifCloneExists': '存在ID为 [ID] 的克隆体？',
      'block.ifCloneInGroup': '[ID]有[GROUP]标签？',
      'block.importGroupIntoList': '将带标签[GROUP]的所有ID [OP] 到列表 [LIST]',
      'block.importTouchingIDsIntoList': '将碰到的[MENU][VALUE]的所有ID [OP] 到列表 [LIST]',
      'block.initTheClone': '克隆体启动前一刻',
      'block.beforeDeletionOfTheClone': '当作为克隆体删除时',
      'block.isCloneOrIsOriginal': '我是[TYPE]吗？',
      'block.isCloneTouchingCoord': '[MENU][VALUE]碰到点x:[X]y:[Y]？',
      'block.isTouchingClone': '碰到[MENU][VALUE]？',
      'block.isCloneTouchingClone': 'ID[ID]碰到[MENU][VALUE]？',
      'block.moveStepsToClone': '朝ID[ID][MOTION][VALUE]',
      'block.moveToClone': '[MOTION]ID[ID]',
      'block.presetDataforTheNextCloneInJSONFormat': '下个克隆体的数据为JSON设为[DATA_JSON]',
      'block.presetGroupForTheNextClone': '下个克隆体添加一个标签[GROUP]',
      'block.presetPropertyForTheNextClone': '下个克隆体的[PROPERTY]设为[VALUE]',
      'block.presetSingleDataForTheNextClone': '下个克隆体数据[KEY]设为[VALUE]',
      'block.presetVarForTheNextClone': '下个克隆体变量[VAR]设为[VALUE]',
      'block.setMyID': '⚠️将我的ID修改为[ID]',
      'block.getGroupsOfClone': '[ID]的所有标签',
      'block.setOrChangeMyValueWithKey': '将我的[KEY][OP][VALUE]',
      'block.setOrChangeValueOfCloneIDWithKey': 'ID[ID]的[KEY][OP][VALUE]',
      'block.setPrivateVarOfClone': 'ID[ID]的变量[VAR][OP][VALUE]',
      'block.transferAccessToTargetXYToDollyDataKey':
        '将扩展中对角色坐标、方向的访问转移到对以下键数据访问：[X_NAME][Y_NAME][DIR_NAME](选填)',
      'block.broadcastToClone': '发送私信[MSG]附带数据[data]给[MENU][VALUE]',
      'block.receiveMyBroadcast': '当我接收到私信[MSG]。附带数据=[data]，发送者ID=[senderID]',
      'block.searchCloneWithKV': '[SPRITE]满足数据[KEY]=[VALUE]的克隆体ID',
      'tooltip.searchCloneWithKV':
        '查找某个角色中，满足特定数据等于特定值的克隆体的ID。\n如果有多个符合，只返回其中一个。',

      'defaultValue.MSGName': '信息1',
      'defaultValue.MSGInfo': '数据',
      'defaultValue.HP': '数据',
      'defaultValue.NO': '编号',
      'defaultValue.direction': '方向',
      'defaultValue.enemy': '敌人',
      'defaultValue.player': '玩家',
      'defaultValue.customID': '自定义ID',
      'defaultValue.presetJSON': '\'{"名称":"普通士兵","生命值":100,"阵营":"红色"}\'',
      'menu.addOrRemove.add': '添加',
      'menu.addOrRemove.remove': '删除',
      'menu.calcBetweenClones.absAngleDifference': '角度差(正数)',
      'menu.calcBetweenClones.angleDifference': '角度差(带符号)',
      'menu.calcBetweenClones.direction': '方向',
      'menu.calcBetweenClones.distance': '距离',
      'menu.cloneProperty.IDList': 'ID列表',
      'menu.cloneProperty.allSprite': '所有角色',
      'menu.cloneProperty.anySprite': '任意角色',
      'menu.cloneProperty.count': '数量',
      'menu.cloneProperty.json': 'JSON',
      'menu.cloneProperty.myself': '自己',
      'menu.dataop.change': '增加',
      'menu.dataop.set': '设为',
      'menu.listop.insert': '添加',
      'menu.listop.replace': '覆盖',
      'menu.miton.PointAt': '面向',
      'menu.miton.moveSteps': '移动步数',
      'menu.miton.moveTo': '移到',
      'menu.miton.rotateDegrees': '旋转角度',
      'menu.oneOrAll.all': '所有',
      'menu.oneOrAll.one': '一个',
      'menu.spriteProperty._size': '大小',
      'menu.spriteProperty._visible': '显示?',
      'menu.spriteProperty._x': 'x 坐标',
      'menu.spriteProperty._y': 'y 坐标',
      'menu.spriteProperty.currentCostume': '造型编号',
      'menu.spriteProperty.currentCostumeName': '造型名',
      'menu.spriteProperty.direction': '方向',
      'menu.spriteProperty.id': 'ID',
      'menu.spriteProperty.name': '角色名',
      'menu.spriteProperty.dataJSON': '附带数据JSON',
      'menu.spriteProperty.extraDataObj': '🗄️数据对象',
      'menu.targetType.ID': 'ID',
      'menu.targetType.group': '标签',
      'menu.targetType.sprite': '角色',
      'menu.targetType.spriteClone': '角色(本体和克隆体)',
      'menu.targetType.spriteOnly': '角色(仅本体)',
      'menu.targetType.cloneOnly': '角色(仅克隆体)',
      'menu.type.clone': '克隆体',
      'menu.type.original': '角色本体',
      'menu.color': '颜色特效',
      'menu.fisheye': '鱼眼特效',
      'menu.whirl': '旋涡特效',
      'menu.pixelate': '像素化特效',
      'menu.mosaic': '马赛克特效',
      'menu.brightness': '亮度特效',
      'menu.ghost': '虚像特效',
      'menu.curSprite': '当前角色',
      'menu.curMainSprite': '当前角色本体',
      'block.setCloneProperty': 'ID[ID]的[PROPERTY][OP][VALUE]',

      'tooltip.isCloneOrIsOriginal': '判断自己是克隆体，还是角色本体',
      'tooltip.getCloneTargetPropertyWithSpriteName': '获取所有/特定角色的克隆体的数量/ID列表。其中ID列表以JSON形式返回',
      'tooltip.getCloneTargetPropertyWithSpriteName2': '获取所有/特定角色的克隆体的数量/ID列表。其中ID列表以JSON形式返回',
      'tooltip.getOriginalTargetPropertyWithSpriteName': '获取某角色的ID/x/y/大小等信息',
      'tooltip.getOriginalTargetPropertyWithSpriteName2': '获取某角色的ID/x/y/大小等信息',
      'tooltip.ifCloneExists': '判断特定ID的克隆体或角色是否存在',
      'tooltip.presetPropertyForTheNextClone':
        '预设置下一个克隆体的x/y/方向等属性。\n注：只会影响下一个克隆体的属性。每次克隆会清空预设的属性。',
      'tooltip.presetSingleDataForTheNextClone':
        '预设置下一个克隆体特定名称的数据（克隆体可使用相关积木读取设置的数据）。\n注：只会影响下一个克隆体的属性。每次克隆会清空预设的属性。',
      'tooltip.presetVarForTheNextClone':
        '预设置下一个克隆体的私有变量的值。\n和直接设置私有变量克隆的区别是，不会影响克隆者本身的私有变量，且可以跨角色设置私有变量。\n注：只会影响下一个克隆体的属性。每次克隆会清空预设的属性。',
      'tooltip.presetDataforTheNextCloneInJSONFormat':
        '预设置下一个克隆体的所有键值对数据。\n注：只会影响下一个克隆体的属性。每次克隆会清空预设的属性。',
      'tooltip.presetGroupForTheNextClone':
        '预设置下一个克隆体要的一个标签，可以多次设置多个标签。\n注：只会影响下一个克隆体的属性。每次克隆会清空预设的属性。',
      'tooltip.createCloneAndSpecifyID':
        '克隆角色并为克隆体指定一个自定义ID，可以方便后续根据ID获取克隆体信息。\nID不是必要的，可以留空（此时会自动分配ID），或者使用原版克隆积木。\n⚠️如果要设置ID，则要确保ID必须是唯一的。如果克隆时已有相同ID克隆体存在，\n则后来的克隆体仍使用系统分配ID。',
      'tooltip.createCloneAndSpecifyTag':
        '克隆角色并为克隆体添加一个标签，可以方便后续根据标签获取克隆体信息。\n和设置ID的区别是，ID必须唯一，而同一个标签的克隆体可以有多个，更加安全。',
      'tooltip.createCloneAndSpecifyData':
        '克隆角色并为克隆体设置一个数据（例如编号），可以方便后续根据数据查找克隆体。\n注意：相比根据ID查找，根据数据查找克隆体需要遍历所有克隆体，效率较低。',
      'tooltip.getJustCreatedCloneID':
        '获取刚刚克隆出的克隆体ID。可用于为刚产生的克隆体添加一些预设数据，或执行一些其他动作。',
      'tooltip.deleteCloneByID': '删除指定ID的克隆体',
      'tooltip.initTheClone': '类似原版“作为克隆体启动”积木，但总是在其之前触发。可用于执行一些初始化克隆体的动作。',
      'tooltip.beforeDeletionOfTheClone':
        '在克隆体被删除的前一刻触发，由被删除的克隆体执行。可用于执行克隆体删除时的收尾工作。',
      'tooltip.dispatchWhenCloned': '当侦测到特定角色的克隆体产生时触发，机制类似于广播。',
      'tooltip.dispatchWhenCloneDeleted': '当侦测到特定角色的克隆体删除时触发，机制类似于广播。',
      'tooltip.broadcastToClone':
        '向特定ID/标签/角色的克隆体发出私有广播，只有指定对象能够收到并执行。可以携带一个数据。',
      'tooltip.receiveMyBroadcast': '当收到自己特定名称的私信时执行。data是私信附带的数据，senderID是发送者的ID。',
      'tooltip.getMyProperty': '获取当前角色或克隆体的ID/x/y..等信息',
      'tooltip.myID':
        '获取当前克隆体（或角色）的ID。\nID是克隆体的唯一标识，在本扩展中，使用ID来代表和操作一个特定的克隆体个体。例如计算两个特定ID的克隆体间的距离。',
      'tooltip.mySpriteID': '获取当前克隆体所属角色本体的ID。',
      'tooltip.spriteID': '获取某个角色的ID。',
      'tooltip.getMyValueByKey': '获取当前克隆体的附带数据。',
      'tooltip.setOrChangeMyValueWithKey': '设置当前克隆体的附带数据。当数据不存在时自动创建。',
      'tooltip.getValueOfCloneIDWithKey': '获取特定ID的克隆体的附带数据。',
      'tooltip.setOrChangeValueOfCloneIDWithKey': '设置特定ID克隆体的附带数据。',
      'tooltip.getClonePropertyWithID': '获取特定ID克隆体的坐标/方向/大小等信息。',
      'tooltip.setCloneProperty': '设置特定ID克隆体的坐标/方向/大小等信息。',
      'tooltip.getPrivateVarOfClone': '读取特定ID克隆体的某个私有变量。',
      'tooltip.setPrivateVarOfClone': '设置特定ID克隆体的某个私有变量。',
      'tooltip.addOrRemoveMyselfFromGroup': '给当前克隆体（或角色）添加/移除标签。一个克隆体可以同时添加多个不同标签。',
      'tooltip.addOrRemoveIDFromGroup': '将特定ID克隆体添加/移除标签。一个克隆体可以同时添加多个不同标签。',
      'tooltip.ifCloneInGroup': '判断特定ID的克隆体是否有某个标签',
      'tooltip.getGroupsOfClone': '获取某ID克隆体的所有标签。一个克隆体可能有多个标签，结果返回JSON列表。',
      'tooltip.getGroupInfo': '获取所有带特定标签的克隆体的数量/ID列表。',
      'tooltip.getClonePropertyInGroup': '获取第n个克隆体的ID等信息',
      'tooltip.importGroupIntoList': '将带特定标签的克隆体ID表导入到某个列表中。',
      'tooltip.forEachWithGroup':
        '遍历所有带特定标签的克隆体。\n⚠️注：该C型积木目前不完全兼容编译模式，会破坏代码编译，导致性能降低，谨慎使用。',
      'tooltip.cloneIDOfForEach': '记录当前遍历的克隆体的ID。',
      'tooltip.getNearestClone': '获取离当前角色最近或最远的带指定标签的克隆体ID',
      'tooltip.getTouchingID':
        '获取碰到的带指定标签的克隆体ID。可选返回其中一ID，或全部ID。返回全部ID时，结果为JSON列表。',
      'tooltip.importTouchingIDsIntoList': '将碰到的带指定标签的所有克隆体的ID导入到列表。',
      'tooltip.isTouchingClone': '判断是否碰到某个ID的克隆体/某个标签的克隆体/某角色名称的克隆体',
      'tooltip.isCloneTouchingClone': '判断某ID克隆体是否碰到另一个ID的克隆体，或标签/角色名的克隆体',
      'tooltip.isCloneTouchingCoord': '判断某个ID/标签名/角色名的克隆体是否碰到点坐标',
      'tooltip.pickTarget': '选取在坐标位置处于最顶层的克隆体的ID。',
      'tooltip.calcDistanceToClone':
        '计算当前角色到特定ID克隆体的距离/方向/角度差/带符号角度差：\n\n@当前角色@目标克隆体',
      'tooltip.calcDistanceBetweenClones':
        '计算两个指定ID克隆体之间的距离/方向/角度差/带符号角度差：\n\n@克隆体@另一个克隆体',
      'tooltip.infoBetweenCloneAndPoint': '计算特定克隆体到某个点的距离/方向/角度差/带符号角度差：\n\n@克隆体@目标点',
      'tooltip.disOptions':
        '- 距离：%s1到%s2的距离；\n' +
        '- 方向：%s1面向%s2时的方向，例如90°表示%s2在右边；\n' +
        '- 角度差(正数)：离面向%s2还差多少度(正数)。可用“角度差<1”判断朝%s2旋转时，是否已经对准了%s2。\n' +
        '- 角度差(带符号)：离面向%s2还差多少度(带符号)，可用于表示还要旋转多少角度才能面向%s2，其中正数表示顺时针差，负数表示逆时针差。',
      'tooltip.moveToClone': '面向/移到某个ID的克隆体',
      'tooltip.moveStepsToClone': '朝某个ID的克隆体移动/旋转特定的步数/角度',
      'tooltip.setMyID': '修改我的ID为新ID。确保在修改前，没有其他地方通过ID引用这个克隆体，避免出现问题。',
      'tooltip.transferAccessToTargetXYToDollyDataKey':
        '将扩展中的计算距离、方向的积木，从使用角色的原版坐标进行计算，转移到使用特定名称的附加数据进行计算。',
      'tooltip.cancelAccessTransfer': '取消上一个积木的计算转移效果。',
    },
    en: {
      name: 'Dolly Pro',
      urlButton: '📖 Tutorial',
      url: 'https://getgandi.com/extensions/dolly-pro',
      'tag.utils': '🔧 Common Tools',
      'tag.event': '🔔 Event',
      'tag.cloneAndDelete': '🪄 Clone and Delete',
      'tag.data': '📄 Data Access',
      'tag.group': '🏷️ Clone Tag',
      'tag.motion': '🚶 Motion',
      'tag.sensing': '🔍 Sensing',
      'tag.test': '🚧 Experimental Blocks',
      'button.showBlock': '💡 show other blocks',
      'button.hideBlock': 'hide other blocks',
      'menu.targetType.IDlist': 'ID list',

      'block.removeAllTags': 'remove all tags for [ID]',
      'stage': 'Stage',
      'warn.newIDIsOldID': 'The modified sprite ID is already "%s"!',
      'warn.repetitveID': 'There is already a clone or sprite with ID "%s", please do not set the same ID!',
      'error.repetitiveID': 'There is already a clone with the ID "%s". Please do not use the same ID when cloning!',
      'config.tip':
        'Configuration for Arkos Extension(Inspired by TurboWarp)\nYou can move, resize, and minimize this comment, but better not edit it by hand. This comment can be deleted to remove the stored settings.',

      'confirm.showBlock?':
        'To avoid clutter, some infrequently used blocks are hidden.\nDo you want to show hidden blocks?',
      'block.addOrRemoveIDFromGroup': '[OP]ID[ID]as[GROUP]',
      'block.pickTarget': 'ID of the top-most at x:[X]y:[Y]',
      'block.addOrRemoveMyselfFromGroup': '[OP]myself as[GROUP]',
      'menu.addOrRemove.add': 'tag',
      'menu.addOrRemove.remove': 'untag',
      'block.calcDistanceBetweenClones': '[MENU] from [ID1] to [ID2]',
      'block.infoBetweenCloneAndPoint': '[MENU] from [ID] to x:[X]y:[Y]',
      'menu.calcBetweenClones.direction': 'direction',
      'menu.calcBetweenClones.distance': 'distance',
      'menu.calcBetweenClones.absAngleDifference': 'angle(absolute)',
      'menu.calcBetweenClones.angleDifference': 'angle(signed)',
      'block.calcDistanceToClone': '[MENU] to ID[ID]',
      'block.myID': 'my ID',
      'block.mySpriteName': 'my sprite name',
      'block.mySpriteID': 'my original sprite ID',
      'block.spriteID': 'ID of [TARGET]',
      'block.tagID': 'ID of clone with tag[TAG]',
      'tooltip.tagID':
        'Get the ID of a clone with a specified tag, returning only one of them if there are multiple clones with the same tag.',
      'block.cancelAccessTransfer': 'cancel the transfer of coordinate/direction data access',
      'block.cloneIDOfForEach': '⚠️current clone ID',
      'block.createCloneAndSpecifyID': 'create clone of [TARGET]with ID[ID]',
      'block.createCloneAndSpecifyTag': 'create clone of [TARGET]with tag[TAG]',
      'block.createCloneAndSpecifyData': 'create clone of [TARGET]with data[KEY]set to[VALUE]',
      'block.deleteCloneByID': 'delete clone[ID]',
      'block.dispatchWhenCloneDeleted': 'when clone of [TARGET] is deteted. deletedID = [ID]',
      'block.dispatchWhenCloned': 'when  clone of[TARGET] is created. cloneID = [ID]',
      'block.forEachWithGroup': '⚠️for each clone with tag[GROUP]',
      'block.getClonePropertyInGroup': '[PROPERTY] of #[INDEX] clone with tag[GROUP]',
      'block.getClonePropertyWithID': '[PROPERTY] of ID[ID]',
      'block.getCloneTargetPropertyWithSpriteName': 'clone [PROPERTY] of [TARGET]',
      'block.getGroupInfo': '[PROPERTY] of clones with tag [GROUP]',
      'block.getJustCreatedCloneID': "just created clone's ID",
      'block.getMyProperty': 'my [PROPERTY]',
      'block.getMyValueByKey': 'my[KEY]',
      'block.getNearestClone': 'get [TYPE][MENU][VALUE]',
      'block.getNearestForID': 'get [TYPE][MENU][VALUE]for[ID]',
      'block.getNearestSpriteClone': 'get[TYPE] of[SPRITE]',
      'block.getNearestTagClone': 'get[TYPE] with tag[TAG]',
      'block.getGroupsOfClone': 'all tags of ID[ID]',
      'menu.nearest': 'nearest',
      'menu.farthest': 'farthest',
      'menu.targetType.ID': 'ID',
      'menu.targetType.group': 'tag',
      'menu.targetType.sprite': 'sprite',
      'menu.targetType.spriteClone': 'sprite & its clones',
      'menu.targetType.spriteOnly': 'sprite only',
      'menu.targetType.cloneOnly': 'sprite\'s clones',
      'block.getOriginalTargetPropertyWithSpriteName': '[PROPERTY] of [TARGET]',
      'block.getTouchingID': "get[TYPE]I'm touching[MENU][VALUE]",
      'block.getTouchingSpriteID': "get [TYPE] ID of [SPRITE] I'm touching",
      'block.getTouchingTagID': "get [TYPE] ID with [TAG] I'm touching",
      'menu.oneOrAll.all': 'all',
      'menu.oneOrAll.one': 'one',
      'block.getValueOfCloneIDWithKey': '[KEY]of ID[ID]',
      'block.getPrivateVarOfClone': 'variable[VAR]of ID[ID]',
      'block.ifCloneExists': 'clone with ID[ID]exists?',
      'block.ifCloneInGroup': 'ID[ID]tagged as[GROUP]?',
      'block.importGroupIntoList': '[OP]list[LIST]with IDs of clones with tag[GROUP]',
      'menu.listop.insert': 'insert',
      'menu.listop.replace': 'replace',
      'block.importTouchingIDsIntoList': "[OP]list[LIST]with clone IDs I'm touching[MENU][VALUE]",
      'block.initTheClone': 'right before I start as a clone',
      'block.beforeDeletionOfTheClone': "when I'm deleted as a clone",
      'block.isCloneOrIsOriginal': 'am I [TYPE]?',
      'menu.type.clone': 'a clone',
      'menu.type.original': 'the original sprite',
      'block.isCloneTouchingCoord': '[MENU][VALUE]touching x:[X]y:[Y]?',
      'block.isTouchingClone': 'touching[MENU][VALUE]?',
      'block.isCloneTouchingClone': 'ID[ID]touching[MENU][VALUE]',
      'block.moveStepsToClone': '[MOTION][VALUE]towards ID[ID]',
      'menu.miton.moveSteps': 'move steps',
      'menu.miton.rotateDegrees': 'turn degrees',
      'block.moveToClone': '[MOTION]ID[ID]',
      'menu.miton.PointAt': 'point towards',
      'menu.miton.moveTo': 'go to',
      'block.presetDataforTheNextCloneInJSONFormat': 'preset data of the next clone as JSON[DATA_JSON]',
      'block.presetGroupForTheNextClone': 'add tag[GROUP] for the next clone',
      'block.presetPropertyForTheNextClone': 'preset [PROPERTY] of the next clone to[VALUE]',
      'block.presetSingleDataForTheNextClone': 'preset [KEY] of the next clone to [VALUE]',
      'block.presetVarForTheNextClone': 'preset variable[VAR] of the next clone to [VALUE]',
      'block.setMyID': '⚠️modify my ID to[ID]',
      'block.setOrChangeMyValueWithKey': 'my[KEY][OP][VALUE]',
      'block.setOrChangeValueOfCloneIDWithKey': '[KEY]of ID[ID][OP][VALUE]',
      'block.setPrivateVarOfClone': 'variable[VAR]of ID[ID][OP][VALUE]',
      'menu.dataop.change': 'change by',
      'menu.dataop.set': 'set to',
      'block.transferAccessToTargetXYToDollyDataKey':
        'transfer access to sprite coordinates and direction in the extension to the following key data: [X_NAME], [Y_NAME], [DIR_NAME] (optional)',
      'defaultValue.HP': 'data',
      'defaultValue.NO': 'number',
      'defaultValue.direction': 'direction',
      'defaultValue.enemy': 'enemy',
      'defaultValue.player': 'player',
      'defaultValue.customID': 'custom ID',
      'defaultValue.presetJSON': '\'{"name":"common soldier ","HP":100,"team":"red"}\'',
      'menu.cloneProperty.IDList': 'ID list',
      'menu.cloneProperty.allSprite': 'all sprites',
      'menu.cloneProperty.anySprite': 'any sprite',
      'menu.cloneProperty.count': 'count',
      'menu.cloneProperty.json': 'JSON',
      'menu.cloneProperty.myself': 'myself',
      'menu.spriteProperty._size': 'size',
      'menu.spriteProperty._visible': 'visible?',
      'menu.spriteProperty._x': 'x position',
      'menu.spriteProperty._y': 'y position',
      'menu.spriteProperty.currentCostume': 'costume number',
      'menu.spriteProperty.currentCostumeName': 'costume name',
      'menu.spriteProperty.direction': 'direction',
      'menu.spriteProperty.id': 'ID',
      'menu.spriteProperty.name': 'sprite name',
      'menu.spriteProperty.dataJSON': 'data in JSON format',
      'menu.spriteProperty.extraDataObj': '🗄️data object',
      'menu.color': 'color effect',
      'menu.fisheye': 'fisheye effect',
      'menu.whirl': 'whirl effect',
      'menu.pixelate': 'pixelate effect',
      'menu.mosaic': 'mosaic effect',
      'menu.brightness': 'brightness effect',
      'menu.ghost': 'ghost effect',
      'menu.curSprite': 'current sprite',
      'menu.curMainSprite': 'my original sprite',

      'block.broadcastToClone': 'send private message[MSG] to[MENU][VALUE], with data[data]',
      'block.receiveMyBroadcast': 'when I receive private message[MSG] for me. data=[data]，senderID=[senderID]',
      'defaultValue.MSGName': 'message1',
      'defaultValue.MSGInfo': 'data',
      'block.setCloneProperty': '[PROPERTY]of ID[ID][OP][VALUE]',
      'block.searchCloneWithKV': 'clone ID of[SPRITE]with data[KEY]set to[VALUE]',
      'tooltip.searchCloneWithKV':
        'Find ID of a clone in a sprite that satisfies a specific data equaling a particular value. If there are multiple matches, return only one of them.',

      'tooltip.isCloneOrIsOriginal': 'Determine whether it is a clone or the original sprite.',
      'tooltip.getCloneTargetPropertyWithSpriteName':
        "Get the number/ID list of all clones or a specific sprite's clones.",
      'tooltip.getCloneTargetPropertyWithSpriteName2': "Get the number/ID list of all clones/specific sprite's clones.",
      'tooltip.getOriginalTargetPropertyWithSpriteName': 'Get the ID/x/y/size/etc. of a sprite.',
      'tooltip.getOriginalTargetPropertyWithSpriteName2': 'Get the ID/x/y/size/etc. of a sprite.',
      'tooltip.ifCloneExists': 'Check if a clone with specific ID exists.',
      'tooltip.presetPropertyForTheNextClone': 'Pre-set the x/y/direction/etc. attributes for the next clone.',
      'tooltip.presetSingleDataForTheNextClone': 'Pre-set key-value data for the next clone.',
      'tooltip.presetVarForTheNextClone':
        "Pre-set the value of a private variable for the next clone. \nUnlike directly setting private variables for clones, this won't affect the variables of the cloner itself and can be used across sprites.",
      'tooltip.presetDataforTheNextCloneInJSONFormat': 'Pre-set all key-value data for the next clone.',
      'tooltip.presetGroupForTheNextClone': 'Pre-set a tag to add for the next clone. Multiple tags can be added.',
      'tooltip.createCloneAndSpecifyID':
        'Clone a sprite and assign a custom ID to the clone, make it easier to retrieve clone information based on the ID later. \nThe ID is not mandatory and can be left blank (in which case an ID will be automatically assigned), or you can use the original cloning block. \nIf you want to set an ID, make sure it is unique. If a clone with the same ID already exists at the time of cloning, \nthe subsequent clone will still use a system-assigned ID.',
      'tooltip.createCloneAndSpecifyTag':
        'Clone a sprite and add a tag to the clone to make it easier to get clone information based on the tag later.\nThe difference from setting an ID is that an ID must be unique, while multiple clones can have the same tag, making it more flexible and safe.',
      'tooltip.createCloneAndSpecifyData':
        'Clone a sprite and assign a piece of data (such as a number) to the clone, make it easier to find the clone based on that data.\nNote: Compared to finding clones by ID or tag, searching for clones based on data requires iterating through all clones, which can be less efficient.',
      'tooltip.getJustCreatedCloneID':
        'Get ID of the just created clone. This can be used to perform certain actions on the new clone, such as setting its data.',
      'tooltip.deleteCloneByID': 'Delete the clone with the specified ID.',
      'tooltip.initTheClone':
        'Similar to the original "when I start as a clone" but always triggered before it. Can be used to perform some actions to initialize the clone.',
      'tooltip.beforeDeletionOfTheClone':
        'Triggered just before the clone is deleted, executed by the deleted clone. Can be used to perform final actions when a clone is deleted.',
      'tooltip.dispatchWhenCloned':
        'Triggered when a clone of a specific sprite is created, similar to broadcasting and will be executed by both clones and sprites.',
      'tooltip.dispatchWhenCloneDeleted':
        'Triggered when a clone of a specific sprite is deleted, similar to broadcasting and will be executed by both clones and sprites.',
      'tooltip.broadcastToClone':
        'Send a private message to clones with specific ID/tag/sprite. Only specified targets can receive it.',
      'tooltip.receiveMyBroadcast': 'Execute when receiving a private message with a specific name.',
      'tooltip.getMyProperty': 'Get ID/x/y/etc. of the current sprite or clone.',
      'tooltip.myID':
        'Get ID of the current clone (or sprite). The ID is a unique identifier for clones, used to represent and manipulate a specific clone individual.',
      'tooltip.mySpriteID': 'Get ID of the original sprite to which the current clone belongs.',
      'tooltip.spriteID': 'Get ID of a specific sprite.',
      'tooltip.getMyValueByKey': 'Get attached key-value data of the current clone.',
      'tooltip.setOrChangeMyValueWithKey':
        "Get attached key-value data for the current clone. Automatically creates when data doesn't exist.",
      'tooltip.getValueOfCloneIDWithKey': 'Get attached key-value data of the clone with specific ID.',
      'tooltip.setOrChangeValueOfCloneIDWithKey': 'Set attached key-value data for the clone with specific ID.',
      'tooltip.getClonePropertyWithID': 'Get x/y/size/etc. of the clone with specific ID.',
      'tooltip.setCloneProperty': 'Set x/y/size/etc. of the clone with specific ID.',
      'tooltip.getPrivateVarOfClone': 'Read a private variable of the clone with specific ID.',
      'tooltip.setPrivateVarOfClone': 'Set a private variable of the clone with specific ID.',
      'tooltip.addOrRemoveMyselfFromGroup':
        'Add/remove a tag to/from the current clone (or sprite). A clone can have multiple tags.',
      'tooltip.addOrRemoveIDFromGroup':
        'Add/remove a tag to/from the clone with specific ID. A clone can have multiple tags.',
      'tooltip.ifCloneInGroup': 'Check if the clone with specific ID has a certain tag.',
      'tooltip.getGroupsOfClone':
        'Get all tags of the clone with specific ID.\nA clone can have multiple tags, in which case the result will be a JSON list.',
      'tooltip.getGroupInfo': 'Get the number/ID list of clones with a specific tag.',
      'tooltip.getClonePropertyInGroup': 'Get ID or other information of the nth clone with tag.',
      'tooltip.importGroupIntoList': 'Import IDs of clones with the specific tag into a list.',
      'tooltip.forEachWithGroup':
        'Iterate through each clone with the specific tag. \n⚠️Note: This C-type block is currently not fully compatible with compilation mode, which may degrade performance, use with caution.',
      'tooltip.cloneIDOfForEach': 'Record the ID of the currently iterated clone.',
      'tooltip.getNearestClone': 'Get the ID of the nearest or farthest clone with specific tag from the current sprite.',
      'tooltip.getTouchingID':
        'Get the ID of tagged clone(s) the current sprite touching.\nOptionally returns either one ID or all IDs. When returning all IDs, the result is a JSON list.',
      'tooltip.importTouchingIDsIntoList': 'Import the IDs of all touching clones with a specific tag into a list.',
      'tooltip.isTouchingClone': 'Check if the current sprite is touching the clone with specific ID/tag/sprite.',
      'tooltip.isCloneTouchingClone': 'Check if the clone with specific ID is touching another clone with ID/tag/sprite.',
      'tooltip.isCloneTouchingCoord': 'Check if the clone with specific ID/tag/sprite is touching a point.',
      'tooltip.pickTarget': 'Select the ID of the topmost clone at a specific point.',
      'tooltip.calcDistanceToClone':
        'Calculate the distance/direction/angle difference from the current sprite to the clone with specific ID.\n\n@current sprite@target clone',
      'tooltip.calcDistanceBetweenClones':
        'Calculate the distance/direction/angle difference between two specified clone IDs.\n\n@one clone@another clone',
      'tooltip.infoBetweenCloneAndPoint':
        'Calculate the distance/direction/angle difference between the specified clone and a point.\n\n@clone@target point',
      'tooltip.disOptions':
        '- Distance: The distance between %s1 and %s2;\n' +
        '- Direction: The direction when %s1 faces %s2;\n' +
        '- Angle Difference (Positive): How many degrees %s1 needs to rotate to face %s2. You can use "Angle Difference < 1" to judge if %s1 has already pointed to %s2 when rotating towards it.\n' +
        '- Angle Difference (Signed): How many degrees (with sign, + for clockwise, and - for ccw) %s1 needs to rotate to face %s2.\nCan be used to indicate how much rotation is required to face the %s2.',
      'tooltip.moveToClone': 'Move/rotate towards the clone with specific ID.',
      'tooltip.moveStepsToClone': 'Move/rotate a specific number of steps/degrees towards the clone with specific ID.',
      'tooltip.setMyID':
        'Change the sprite ID to a new ID. Make sure there are no other references to this clone by ID before modification to avoid issues.',
      'tooltip.transferAccessToTargetXYToDollyDataKey':
        "Transfer the calculation of distance/direction in this extension from using the sprite's original x/y to using specific key-value data names.",
      'tooltip.cancelAccessTransfer': 'Cancel the calculation transfer effect of the previous block.',
    },
  };

  
// #endregion
// --------------- END src/dollyPro/l10n.js --------------- 

  // #region --------------- START: src/utils/setupTranslation.js --------------- 

  function setupTranslation(l10n) {
    let fm;
    if (window.Scratch.vm.runtime.getFormatMessage) {
      fm = window.Scratch.vm.runtime.getFormatMessage(l10n);
    } else {
      // tw
      // 键要带下划线 _
      const newL10n = {};
      Object.entries(l10n).forEach(([key, lan]) => {
        newL10n[key] = Object.fromEntries(Object.entries(lan).map(([k, v]) => ['_' + k, v]));
      });
      window.Scratch.translate.setup(newL10n);
      fm = window.Scratch.translate;
    }
    return fm;
  }

  
// #endregion
// --------------- END src/utils/setupTranslation.js --------------- 

  // #region --------------- START: src/utils/patcher.js --------------- 

  // patcher.js by GPT5

  const hasOwn$1 = Object.prototype.hasOwnProperty;

  let _REGISTRY; // WeakMap<owner, Map<methodName, record>>
  /*
   record = {
     patched: Function|any,
     patches: Array<{
      id:string,
      factory: (next)=>Function,
      wrapper: Function,
      before: Function, 
      after: Function, 
     }>
     befores: Array<Function>
     afters: Array<Function>
   }
  */

  class Patcher {
    /**
     * new Patcher(id, options)
     * options:
     *  @param {string} id - 插件id
     *  @param {object} options
     *  @param {boolean} options.patchOwner: (默认 true)  -> 尽量在 owner (原型处) 上打补丁以提升性能
     *  @param {boolean} options.record: (默认 true)  -> 是否记录补丁，用于unpatchAll
     */
    constructor(id, options = {}) {
      // 全局共用一个 Patcher
      if (!window.__Arkos_Patcher_REGISTRY) {
        window.__Arkos_Patcher_REGISTRY = new WeakMap();
      }
      _REGISTRY = window.__Arkos_Patcher_REGISTRY;
      if (!id) throw new Error('Patcher requires an id');
      this.id = String(id);
      this.options = {
        patchOwner: options.patchOwner !== undefined ? !!options.patchOwner : true, // 默认true
        record: options.record !== undefined ? !!options.record : true, // 默认true
      };
    }

    // ---------- helper: 寻找属性的 owner（沿原型链向上查找第一个拥有该属性的对象） ----------
    static _findOwner(target, methodName) {
      if (!target) return null;
      let obj = target;
      while (obj) {
        if (hasOwn$1.call(obj, methodName)) return obj;
        obj = Object.getPrototypeOf(obj);
      }
      return null;
    }

    static _factory(rec, befores, afters, owner, methodName) {
      return function patched(...args) {
        // console.log('patched called', methodName, args);
        for (let i = 0; i < befores.length; i++) {
          const res = befores[i].apply(this, args);
          // 提前返回
          if (res !== undefined) return res;
        }
        let res = rec.wrapped.apply(this, args);
        afters.forEach((f) => {
          f.call(this, res, ...args);
        });
        return res;
      };
    }

    // ---------- registry helper: owner 作为 key ----------
    static _getRecord(owner, methodName, createIfMissing = false) {
      if (!owner || !owner[methodName]) {
        console.warn(`Patcher: failed to find method ${methodName} in owner`, owner);
        return null;
      }
      let map = _REGISTRY.get(owner);
      if (!map) {
        if (!createIfMissing) return null;
        map = new Map();
        _REGISTRY.set(owner, map);
      }
      let rec = map.get(methodName);
      if (!rec && createIfMissing) {
        const befores = [];
        const afters = [];
        const original = owner[methodName];
        rec = { original, befores, afters, patches: [], wrapped: original };
        const patched = Patcher._factory(rec, befores, afters, owner, methodName);
        try {
          owner[methodName] = patched;
        } catch (e) {
          console.warn(`Patcher: failed to install patched method ${methodName}`, e);
        }
        map.set(methodName, rec);
      }
      return rec;
    }

    // ---------- compose 并安装最终函数 ----------
    static _recomposeAndInstall(owner, methodName, rec) {
      // 应用 before/after 钩子
      const befores = rec.patches.map((p) => p.before).filter((f) => typeof f === 'function');
      const afters = rec.patches.map((p) => p.after).filter((f) => typeof f === 'function');
      // 清空原钩子
      rec.afters.length = 0;
      rec.befores.length = 0;
      rec.afters.push(...afters);
      rec.befores.push(...befores);
      // 检查是否有replace
      const replace = rec.patches.find((p) => typeof p.replace === 'function')?.replace;
      let fn = replace || rec.original;
      // 应用 wrapper
      const useWrapper = (wrapper, next) => {
        return function(...args) {
          return wrapper.call(this, next, ...args);
        };
      };
      rec.patches.forEach(({ wrapper, factory }) => {
        if (typeof factory === 'function') {
          fn = factory(fn);
        } else if (typeof wrapper === 'function') {
          fn = useWrapper(wrapper, fn);
        }
      });
      rec.wrapped = fn;
    }

    // ---------- 记录反向索引 Map<id, Map<owner, Set<methodName>>> ----------
    static _recordReverse(id, owner, methodName) {
      if (!Patcher._reverse) Patcher._reverse = new Map();
      let ownerMap = Patcher._reverse.get(id);
      if (!ownerMap) {
        ownerMap = new Map();
        Patcher._reverse.set(id, ownerMap);
      }
      let methodSet = ownerMap.get(owner);
      if (!methodSet) {
        methodSet = new Set();
        ownerMap.set(owner, methodSet);
      }
      methodSet.add(methodName);
    }

    // ---------- 公共 API: patch (便捷写法) ----------
    patch(target, methodName, spec) {
      if (!target || typeof methodName !== 'string') {
        throw new Error('patch(target, methodName, spec) - invalid args');
      }

      const owner = this.options.patchOwner ? Patcher._findOwner(target, methodName) || target : target;
      const rec = Patcher._getRecord(owner, methodName, true);
      if (!rec) return false;

      let patch;
      if (typeof spec === 'function') {
        patch = {
          id: this.id,
          wrapper: spec,
        };
      } else if (spec) {
        patch = {
          id: this.id,
          factory: spec.factory,
          wrapper: spec.wrapper,
          before: spec.before,
          after: spec.after,
          replace: spec.replace,
        };
      } else {
        // 处理空对象的情况
        patch = {
          id: this.id,
        };
      }

      const existingIndex = rec.patches.findIndex((p) => p.id === this.id);
      if (existingIndex >= 0) {
        // 已经 patch 了
        // 如果新补丁设置了patchOnce，则不覆盖
        if (spec && spec.patchOnce) {
          return false;
        }
        rec.patches[existingIndex] = patch;
      } else {
        rec.patches.push(patch);
      }
      if (this.options.record) Patcher._recordReverse(this.id, owner, methodName);
      Patcher._recomposeAndInstall(owner, methodName, rec);

      return true;

      // return { unpatch: () => this.unpatch(target, methodName) };
    }

    // ---------- Unpatch ----------
    unpatch(target, methodName) {
      if (!target || typeof methodName !== 'string') return false;
      const owner = this.options.patchOwner ? Patcher._findOwner(target, methodName) || target : target;
      const rec = Patcher._getRecord(owner, methodName, false);
      if (!rec) return false;
      const idx = rec.patches.findIndex((p) => p.id === this.id);
      if (idx === -1) return false;
      rec.patches.splice(idx, 1);
      Patcher._recomposeAndInstall(owner, methodName, rec);

      // 更新 reverse index
      if (Patcher._reverse) {
        const ownerMap = Patcher._reverse.get(this.id);
        if (ownerMap) {
          const methodSet = ownerMap.get(owner);
          if (methodSet) {
            methodSet.delete(methodName);
            if (methodSet.size === 0) ownerMap.delete(owner);
          }
          if (ownerMap.size === 0) Patcher._reverse.delete(this.id);
        }
      }

      return true;
    }

    // ---------- Unpatch All by this id ----------
    unpatchAll() {
      if (!Patcher._reverse) return 0;
      const ownerMap = Patcher._reverse.get(this.id);
      if (!ownerMap) return 0;
      let count = 0;
      for (const [owner, methodSet] of ownerMap.entries()) {
        for (const methodName of methodSet) {
          if (this.unpatch(owner, methodName)) count++;
        }
      }
      Patcher._reverse.delete(this.id);
      return count;
    }

    // ---------- list patches for this id ----------
    listPatches() {
      if (!Patcher._reverse) return [];
      const ownerMap = Patcher._reverse.get(this.id);
      if (!ownerMap) return [];
      const out = [];
      for (const [owner, methodSet] of ownerMap.entries()) {
        for (const methodName of methodSet) {
          out.push({ owner, methodName });
        }
      }
      return out;
    }
  }

  // ---------------------------
  // 示例（直接运行测试）
  // ---------------------------

  // Demo
  // const obj = {
  //   value(x) { return x * 2; }
  // };

  // const p1 = new Patcher('logger1');
  // const p2 = new Patcher('doubleWrap');

  // p1.patch(obj, 'value', {
  //   before: function(x) { console.log('[p1] before', x); },
  //   after: function(res, x) { console.log('[p1] after', res); }
  // });

  // p2.patch(obj, 'value', {
  //   before: function(x) { console.log('[p2] before', x); },
  //   after: function(res, x) { console.log('[p2] after', res); }
  // });

  // console.log('call =>', obj.value(3)); // observe logs from p1 and p2

  // console.log('unpatch p1');
  // p1.unpatch(obj, 'value');

  // console.log('call =>', obj.value(4)); // only p2 should run

  // console.log('unpatch p2');
  // p2.unpatch(obj, 'value');

  // console.log('call =>', obj.value(5)); // original restored

  
// #endregion
// --------------- END src/utils/patcher.js --------------- 

  // #region --------------- START: src/utils/utils.js --------------- 


  function getScratchBlocks(runtime = window.Scratch.vm.runtime) {
    // In Gandi, ScratchBlocks can be accessed from the runtime.
    // In TW, ScratchBlocks can be directly accessed from the window.
    return runtime.scratchBlocks || window.ScratchBlocks;
  }

  // 支持XML的BlockType
  function supportXMLBlockType(BlockType, runtime) {
    if (!BlockType.XML) {
      BlockType.XML = 'XML';
      new Patcher('support XML blocktype').patch(runtime, '_convertForScratchBlocks', {
        before: (blockInfo) => {
          if (blockInfo.blockType === BlockType.XML) {
            return {
              info: blockInfo,
              xml: blockInfo.xml,
            };
          }
        }
      });
    }
  }

  const getUid = () => {
    const soup =
          '!#$%()*+,-./:;=?@[]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 20;
    const soupLength = soup.length;
    const id = [];
    for (let i = 0; i < length; i++) {
      id[i] = soup.charAt(Math.random() * soupLength);
    }
    return id.join('');
  };

  /**
   * throttle(fn, wait, options)
   * options: { leading: true, trailing: true }
   *
   * 返回值是节流后的函数，带 .cancel() 和 .flush() 方法
   */
  function throttle(func, wait, options = {}) {
    if (typeof func !== 'function') {
      throw new TypeError('Expected a function');
    }
    const leading = options.leading === undefined ? true : !!options.leading;
    const trailing = options.trailing === undefined ? true : !!options.trailing;

    let timerId = null;
    let lastArgs = null;
    let lastThis = null;
    let lastCallTime = 0; // 上一次实际执行 func 的时间（ms）
    let result;

    const now = () => Date.now();

    function invoke(nowTime) {
      lastCallTime = nowTime;
      result = func.apply(lastThis, lastArgs);
      lastThis = lastArgs = null;
      return result;
    }

    function startTimer(pendingDelay) {
      if (timerId !== null) return;
      timerId = setTimeout(() => {
        timerId = null;
        // 如果 trailing 被允许并且有待执行的 args，则执行一次
        if (trailing && lastArgs) {
          invoke(now());
        } else {
          // 没有待执行任务时，不改变 lastCallTime（保持上次执行时间）
          lastThis = lastArgs = null;
        }
      }, pendingDelay);
    }

    function throttled(...args) {
      const currentTime = now();

      if (!lastCallTime && lastCallTime !== 0) {
        // 初始化（理论上不会走到这，因为 lastCallTime 初始为 0）
        lastCallTime = 0;
      }

      // 当 leading 为 false，在第一次调用时把 lastCallTime 设为 currentTime
      if (!lastCallTime && leading === false) {
        lastCallTime = currentTime;
      }

      const remaining = wait - (currentTime - lastCallTime);

      lastArgs = args;
      lastThis = this;

      // 如果时间已到（或出现系统时间回退导致 remaining > wait），立即执行
      if (remaining <= 0 || remaining > wait) {
        // 如果存在定时器，则清除（因为我们立即执行）
        if (timerId) {
          clearTimeout(timerId);
          timerId = null;
        }
        return invoke(currentTime);
      }

      // 尚未到时间，安排一个 trailing 执行（如果还没有定时器且允许 trailing）
      if (!timerId && trailing) {
        startTimer(remaining);
      }

      return result;
    }

    throttled.cancel = function() {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      lastCallTime = 0;
      lastArgs = lastThis = null;
    };

    throttled.flush = function() {
      // 立即执行任意挂起的 trailing 调用
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
        if (lastArgs) {
          return invoke(now());
        }
      }
      return result;
    };

    return throttled;
  }


  const xmlEscape = function(unsafe) {
    if (typeof unsafe !== 'string') {
      if (Array.isArray(unsafe)) {
        // This happens when we have hacked blocks from 2.0
        // See #1030
        unsafe = String(unsafe);
      } else {
        console.error('Unexpected input recieved in replaceUnsafeChars');
        return unsafe;
      }
    }
    return unsafe.replace(/[<>&'"]/g, c => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
      }
    });
  };

  // 兼容 tw 和 Gandi
  function callStartHatsWithParams(context, requestedHat, data, optTarget) {
    if (context.startHatsWithParams) {
      return context.startHatsWithParams(requestedHat, data, optTarget);
    }
    const fields = (data && typeof data.fields === 'object' && data.fields) || {};
    return context.startHats(requestedHat, fields, optTarget);
  }
  
// #endregion
// --------------- END src/utils/utils.js --------------- 

  // #region --------------- START: src/utils/configSaver.js --------------- 

  // 用于将扩展配置保存到舞台注释区的工具类
  // 虽然 tw 本身有保存扩展数据到 sb3 的功能，但是不支持协作的保存...
  // 因此仍然使用注释来保存扩展配置

  const DEFAULT_CONFIG_MAGIC = '// _EXT_CONFIG_';

  let fm = null;
  const l10n = {
    'zh-cn': {
      'commentConfig.tip': '该注释用于保存扩展的信息\n删除这个注释将清除扩展配置信息。不建议手动编辑内容。',
    },
    en: {
      'commentConfig.tip':
        'This comment is used to store settings for the extensions(Inspired by TurboWarp)\nCan be deleted to remove the stored settings. Do not edit by hand.',
    },
  };
  const SET_THROTTLE_TIME = 4000;
  const SET_THROTTLE_OPTIONS = {
    leading: true,
    trailing: true,
  };

  class ConfigSaver {
    /**
     * 用于将扩展配置保存到舞台注释区的工具类
     * Saving config for extensions in stage's comment. Inspired by TurboWarp.
     * @param {Runtime} runtime
     * @param {string} extensionId
     * @param {Object} options 选填，配置选项
     * @param {string} [options.commentId] 从特定 id 注释中查找配置
     * @param {string} [options.CONFIG_MAGIC] 配置的魔法字符串，用于查找注释
     * @param {string} [options.extName] 扩展名称
     * @param {string} [options.version] 扩展版本
     * @param {string} [options.desc] 扩展描述信息
     */
    constructor(runtime, extensionId, {commentId = null, CONFIG_MAGIC = DEFAULT_CONFIG_MAGIC, extName = '', version = '', desc = ''}) {
      this.runtime = runtime;
      this.CONFIG_MAGIC = CONFIG_MAGIC;
      this.extensionId = extensionId;
      this.commentId = commentId;
      this.extName = extName;
      this.version = version;
      this.desc = desc;

      if (!fm) {
        fm = setupTranslation(l10n);
      }
    }

    /**
     * 获取当前扩展的配置信息
     * @returns {{[settingKey: string]: any} | null}
     */
    getConfig() {
      let options = this._getAllConfig();
      if (!options) return null;
      options = options[this.extensionId];
      if (!options) return null;
      return options;
    }

    /**
     * 查找扩展配置的注释（在舞台区）
     * @returns {Comment | undefined}
     * @private
     */
    _findConfigComment() {
      const stage = this.runtime.getTargetForStage();
      if (!stage || !stage.comments) return undefined;
      const { comments } = stage;
      // 找到特定 id 的注释，使用该注释
      if (this.commentId && comments[this.commentId]) {
        return comments[this.commentId];
      }
      // 否则查找包含魔法字符串的注释
      return Object.values(comments).find((comment) => comment.text.includes(this.CONFIG_MAGIC));
    }

    /**
     * 更新当前扩展的配置信息。使用消抖，频繁更新只有最后一次才保存
     * @param {Object} configObj 扩展数据对象
     */
    storeConfig = throttle((configObj) => {
      // 设置配置
      let config = this._getAllConfig();
      if (!config) config = {};
      const toSave = {};
      if (this.extName) toSave.extName = this.extName;
      if (this.version) toSave.version = this.version;
      if (this.desc) toSave.desc = this.desc;
      Object.assign(toSave, configObj);
      config[this.extensionId] = toSave;

      const text = `${fm('commentConfig.tip')}\n${this.CONFIG_MAGIC}\n${JSON.stringify(config, null, 2)}`;
      const stage = this.runtime.getTargetForStage();
      const comment = this._findConfigComment();
      if (comment) {
        comment.text = text;
        // console.log('配置注释修改', comment.id);
        ConfigSaver._emitCommentsChanged(this.runtime, stage.id, ['update', comment.id, { text }]);
      } else {
        stage.createComment(getUid(), null, text, 1, 1, 400, 200, false);
      }
      this.runtime.emitProjectChanged();
    }, SET_THROTTLE_TIME, SET_THROTTLE_OPTIONS);

    /**
     * 发送注释修改事件，用于协作同步
     * @private
     */
    static _emitCommentsChanged = throttle((runtime, target, changes) => {
      if (!target) return;
      runtime.emitTargetCommentsChanged?.(target, changes);
    }, SET_THROTTLE_TIME, SET_THROTTLE_OPTIONS);

    /**
     * 从注释获取所有扩展配置
     * @returns  {{[extensionId: string]:object}}  {扩展1:...扩展2:...}
     * @private
     */
    _getAllConfig() {
      const comment = this._findConfigComment();
      if (!comment) return undefined;
      // 找到配置信息的JSON文字
      const idx = comment.text.indexOf(this.CONFIG_MAGIC);
      if (idx === -1) return undefined;
      const jsonText = comment.text.substring(idx + this.CONFIG_MAGIC.length);
      try {
        const parsed = JSON.parse(jsonText);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid object');
        }
        return parsed;
      } catch (e) {
        console.warn(`${this.extensionId}: Config comment has invalid JSON`, e);
        return undefined;
      }
    }
  }
  
// #endregion
// --------------- END src/utils/configSaver.js --------------- 

  // #region --------------- START: src/dollyPro/constant.js --------------- 

  // const extensionNS = 'witCat';
  const extensionNS = 'test';
  // tw 的 id 中'.'被视为非法...没办法在tw只能换一个id
  const extensionId = Scratch.vm.runtime.gandi ? `${extensionNS}.dollyPro` : 'dollyPro';

  const CONST = {
    ALL: '_all_',
    MYSELF: '_myself_',
    EMPTY: '',
  };

  /** 保存扩展配置的舞台注释的Id */
  const EXT_CONFIG_COMMENT_ID = '_ArkosExtensionConfig_';

  const icon =
    'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxMDQuMTc4MzUiIGhlaWdodD0iMTAzLjcwMTk5IiB2aWV3Qm94PSIwLDAsMTA0LjE3ODM1LDEwMy43MDE5OSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI2Ny45MTA4MywtMTI4LjE0OTAxKSI+PGcgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aXNQYWludGluZ0xheWVyJnF1b3Q7OnRydWV9IiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMjc2Ljc3ODM3LDE1Ni40MzUxOWMtMS42MjUsLTMuNTc0IC0wLjk2OSwtMTAuMTk3IDMuOSwtMTIuMDIzYzUuMTk5LC0xLjk1IDcuNDc0LC0zLjU3NSAxNy44NzIsNC4yMjRjOC4zMiw2LjI0IDkuNTMzLDEwLjYxNiA5LjEsMTIuMDI0bC01Ljg1LDYuMTc0Yy0wLjQzMywtMS4zIC0zLjEyLC00LjM1NCAtMTAuMzk5LC02LjE3NGMtOS4wOTksLTIuMjc1IC0xMi45OTgsLTAuNjUgLTE0LjYyMywtNC4yMjV6TTM2Ny43NjczNywxNDkuNjM2MTljLTIuNiwyLjkyNSAtMy4yNSw3LjggLTEwLjcyNCw3LjhjLTUuOTc5LDAgLTEwLjI5LDIuODE2IC0xMi42NzMsNS4xOTlsLTYuODI0LC01LjJjMC44NjYsLTIuMzgyIDQuNDg0LC04LjEyMyAxMi4wMjMsLTEyLjAyM2M5LjQyNCwtNC44NzUgMjAuNzk4LDEuMyAxOC4xOTgsNC4yMjR6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0yNzUuMTUzMzcsMTg5LjI1NjE5YzQuNjgsLTYuMjM5IDE4LjE5OCwtOC44ODIgMjQuMzcyLC05LjQyM2MwLC0yLjI3NSAxLjA0LC04LjI1NCA1LjIsLTEzLjk3NGM1LjE5OSwtNy4xNDkgOS4wOTgsLTEyLjk5OCAyNi42NDYsLTEwLjM5OGMxNy41NDgsMi42IDE3LjIyMywyMC4xNDcgMTkuMTczLDI0LjM3MmMxLjk1LDQuMjI0IDAuOTc1LDIxLjQ0NyAtNy43OTksMjguNTk2Yy04Ljc3NCw3LjE1IC0yNi4zMjIsOC40NSAtMzguMDIsOC4xMjRjLTExLjY5OSwtMC4zMjUgLTIxLjEyMywtNS4yIC0yNi45NzIsLTguMTI0Yy01Ljg1LC0yLjkyNCAtOC40NSwtMTEuMzczIC0yLjYsLTE5LjE3M3oiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTMwNy42NDkzNywxNjEuMjYxMTljMC40MzQsLTEuNDA4IC0wLjc4LC01Ljc4NCAtOS4wOTksLTEyLjAyM2MtMTAuMzk4LC03LjggLTEyLjY3MywtNi4xNzUgLTE3Ljg3MywtNC4yMjVjLTQuODY4LDEuODI2IC01LjUyNCw4LjQ0OSAtMy45LDEyLjAyNGMxLjYyNiwzLjU3NCA1LjUyNSwxLjk1IDE0LjYyNCw0LjIyNGM3LjI4LDEuODIgOS45NjYsNC44NzUgMTAuMzk5LDYuMTc0ek0zNDQuMzY5MzcsMTYyLjIzNjE5YzMuMzY4NDUsLTMuMzQ0NjggNy45MjcxLC01LjIxNTA0IDEyLjY3NCwtNS4yYzcuNDc0LDAgOC4xMjQsLTQuODc0IDEwLjcyNCwtNy43OTljMi42LC0yLjkyNCAtOC43NzQsLTkuMDk5IC0xOC4xOTgsLTQuMjI0Yy03LjUzOSwzLjkgLTExLjE1Nyw5LjY0IC0xMi4wMjMsMTIuMDI0ek0zMDQuNzI2MzcsMTY2LjQ2MDE5YzUuMTk5LC03LjE0OSA5LjA5OCwtMTIuOTk4IDI2LjY0NiwtMTAuMzk4YzE3LjU0OCwyLjYgMTcuMjIzLDIwLjE0NyAxOS4xNzMsMjQuMzcyYzEuOTUsNC4yMjQgMC45NzUsMjEuNDQ3IC03LjgsMjguNTk2Yy04Ljc3Myw3LjE1IC0yNi4zMiw4LjQ1IC0zOC4wMiw4LjEyNGMtMTEuNjk4LC0wLjMyNSAtMjEuMTIyLC01LjIgLTI2Ljk3MSwtOC4xMjRjLTUuODUsLTIuOTI0IC04LjQ1LC0xMS4zNzMgLTIuNiwtMTkuMTczYzQuNjgsLTYuMjM5IDE4LjE5OCwtOC44ODIgMjQuMzcyLC05LjQyM2MwLC0yLjI3NSAxLjA0LC04LjI1NCA1LjIsLTEzLjk3NHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI1Ii8+PHBhdGggZD0iTTMzOC43MTUzNywxOTUuOTEwMTljMCwwIC03Ljk1Myw0Ljg4IC0xMy42Miw2LjcxMWMtNi4zMjUsMi4wNDUgLTIyLjU3NCw0Ljk4OSAtMjIuNTc0LDQuOTg5IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iNSIvPjxwYXRoIGQ9Ik0zMTUuNTQ5MzcsMTg1LjY0ODE5Yy0yLjUwNSwyLjAwNyAtMTUuMTY4LC0yLjQ3NCAtMTUuMTY4LC0yLjQ3NGMwLDAgLTguMDE3LDcuOTYzIC0xMS42MzgsNi45ODRjLTMuNjIzLC0wLjk3NyAtMS4xODMsLTEwLjQ0NSAtMS4xODMsLTEwLjQ0NWMwLDAgLTEzLjc2MywtMi42NTYgLTEzLjQ5NSwtNS4yNjhjMC4yNjcsLTIuNjE0IDE0LjQ0LC0zLjk4MiAxNC40NCwtMy45ODJjMCwwIC0wLjQ5LC05LjYwMiAzLjI5NSwtMTAuMjRjMy43OTEsLTAuNjM5IDEwLjExMiw3Ljk4NCAxMC4xMTIsNy45ODRjMCwwIDEzLjQ2LC0zLjI4IDE1LjUzLC0xLjA2YzIuMDc4LDIuMjE4IC04LjE5LDguOTE2IC04LjE5LDguOTE2YzAsMCA4LjgxLDcuNTc2IDYuMjk3LDkuNTg1eiIgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNMjg4LjA1MDM3LDE4NC4zNTcxOWwtMS40MzUsLTQuOTkzbDExLjEyMSwtMTcuNDEybDMuMTA1LDIuNjY0YzAsMCAtMTIuNzYxLDE5LjczNCAtMTIuNzkxLDE5Ljc0MXoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTMxNS41NDkzNywxODUuNjQ4MTljLTIuNTA1LDIuMDA3IC0xNS4xNjgsLTIuNDc0IC0xNS4xNjgsLTIuNDc0YzAsMCAtOC4wMTcsNy45NjMgLTExLjYzOCw2Ljk4NGMtMy42MjMsLTAuOTc3IC0xLjE4MywtMTAuNDQ1IC0xLjE4MywtMTAuNDQ1YzAsMCAtMTMuNzYzLC0yLjY1NiAtMTMuNDk1LC01LjI2OGMwLjI2NywtMi42MTQgMTQuNDQsLTMuOTgyIDE0LjQ0LC0zLjk4MmMwLDAgLTAuNDksLTkuNjAyIDMuMjk1LC0xMC4yNGMzLjc5MSwtMC42MzkgMTAuMTEyLDcuOTg0IDEwLjExMiw3Ljk4NGMwLDAgMTMuNDYsLTMuMjggMTUuNTMsLTEuMDZjMi4wNzgsMi4yMTggLTguMTksOC45MTYgLTguMTksOC45MTZjMCwwIDguODEsNy41NzYgNi4yOTcsOS41ODV6IiBmaWxsPSJub25lIiBzdHJva2Utb3BhY2l0eT0iMC42MjciIHN0cm9rZT0iI2ZmZGMwMCIgc3Ryb2tlLXdpZHRoPSIyLjUiLz48cGF0aCBkPSJNMzU0LjQyNDM3LDE4NS4yNDAxOWMtMi41MTksMS44NyAtMTUuMDIyLC0yLjQyOCAtMTUuMDIyLC0yLjQyOGMwLDAgLTguMDg2LDcuNDMyIC0xMS42NjYsNi40ODhjLTMuNTgyLC0wLjk0NCAtMS4wMSwtOS44MjkgLTEuMDEsLTkuODI5YzAsMCAtMTMuNjIzLC0yLjU5IC0xMy4zMTYsLTUuMDQ0YzAuMzA3LC0yLjQ1NiAxNC40MDIsLTMuNjQ2IDE0LjQwMiwtMy42NDZjMCwwIC0wLjMzNiwtOS4wMyAzLjQzMywtOS42MDZjMy43NzUsLTAuNTc0IDkuOTE1LDcuNTc1IDkuOTE1LDcuNTc1YzAsMCAxMy40MTYsLTIuOTkzIDE1LjQzNywtMC44OTFjMi4wMjksMi4wOTkgLTguMjc0LDguMzI3IC04LjI3NCw4LjMyN2MwLDAgOC42MjgsNy4xODMgNi4xMDEsOS4wNTR6IiBmaWxsPSIjMDAwMDAwIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0zMjYuOTkyMzcsMTg0LjM1ODE5bC0xLjM0NiwtNC43MDRsMTEuMzIsLTE2LjI5NGwzLjA0LDIuNTI1YzAsMCAtMTIuOTg1LDE4LjQ2OCAtMTMuMDE0LDE4LjQ3M3oiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTM1NC40MjQzNywxODUuMjQwMTljLTIuNTE5LDEuODcgLTE1LjAyMiwtMi40MjggLTE1LjAyMiwtMi40MjhjMCwwIC04LjA4Niw3LjQzMiAtMTEuNjY2LDYuNDg4Yy0zLjU4MiwtMC45NDQgLTEuMDEsLTkuODI5IC0xLjAxLC05LjgyOWMwLDAgLTEzLjYyMywtMi41OSAtMTMuMzE2LC01LjA0NGMwLjMwNywtMi40NTYgMTQuNDAyLC0zLjY0NiAxNC40MDIsLTMuNjQ2YzAsMCAtMC4zMzYsLTkuMDMgMy40MzMsLTkuNjA2YzMuNzc1LC0wLjU3NCA5LjkxNSw3LjU3NSA5LjkxNSw3LjU3NWMwLDAgMTMuNDE2LC0yLjk5MyAxNS40MzcsLTAuODkxYzIuMDI5LDIuMDk5IC04LjI3NCw4LjMyNyAtOC4yNzQsOC4zMjdjMCwwIDguNjI4LDcuMTgzIDYuMTAxLDkuMDU0eiIgZmlsbD0ibm9uZSIgc3Ryb2tlLW9wYWNpdHk9IjAuNjI3IiBzdHJva2U9IiNmZmRjMDAiIHN0cm9rZS13aWR0aD0iMi41Ii8+PHBhdGggZD0iTTI2Ny45MTA4MywyMzEuODUwOTl2LTEwMy43MDE5OWgxMDQuMTc4MzV2MTAzLjcwMTk5eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9nPjwvc3ZnPg==';

  
// #endregion
// --------------- END src/dollyPro/constant.js --------------- 

  // #region --------------- START: src/utils/textDropDowns.js --------------- 

  // patch vm and Blockly to enable text dropdowns, which allows people to type directly
  // original by @LilyMakesThings, huge thanks!
  // reference code: https://github.com/TurboWarp/extensions/issues/637
  // License:
  // - MPL2.0(vm part)：This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  // - GPL-3.0(ScratchBlocks part)

  const patchedSymbol = Symbol.for('TEXT_DROPDOWN_PATCH');

  function patchTextDropDowns(runtime) {
    const Blockly = getScratchBlocks(runtime);
    if (!Blockly) return;
    if (Blockly[patchedSymbol]) return;
    Blockly[patchedSymbol] = true;

    const patcher = new Patcher('textDropDownsUtil');

    // ============= vm part =============
    // reference: https://github.com/TurboWarp/scratch-vm/pull/190/files
    patcher.patch(runtime, '_buildMenuForScratchBlocks', {
      after: (res, menuName, menuInfo) => {
        if (menuInfo.acceptText) {
          res.json.colour = '#FFFFFF';
          res.json.colourSecondary = '#FFFFFF';
          res.json.colourTertiary = '#FFFFFF';
          res.json.args0[0].type = 'field_textdropdown';
        }
      },
    });

    patcher.patch(runtime, '_convertPlaceholders', {
      before: function(context, match, placeholder) {
        // Determine whether the argument type is one of the known standard field types
        const argInfo = context.blockInfo.arguments[placeholder] || {};
        const menuInfo = context.categoryInfo.menuInfo[argInfo.menu];
        if (!argInfo.menu || !menuInfo.acceptText) {
          return;
        }

        // Start to construct the scratch-blocks style JSON defining how the block should be
        // laid out
        let argJSON = {
          type: '',
          name: placeholder
        };

        let defaultValue = typeof argInfo.defaultValue === 'undefined' ? null : String(argInfo.defaultValue);

        let valueName;
        let shadowType;
        let fieldName;
        
        if (menuInfo.acceptReporters) {
          argJSON.type = 'input_value';
          valueName = placeholder;
          shadowType = this._makeExtensionMenuId(argInfo.menu, context.categoryInfo.id);
          fieldName = argInfo.menu;
        } else {
          argJSON.type = 'field_textdropdown';
          argJSON.options = this._convertMenuItems(menuInfo.items);
          valueName = null;
          shadowType = null;
          fieldName = placeholder;
        }

        // <value> is the ScratchBlocks name for a block input.
        if (valueName) {
          context.inputList.push(`<value name="${xmlEscape(placeholder)}">`);
        }

        // The <shadow> is a placeholder for a reporter and is visible when there's no reporter in this input.
        // Boolean inputs don't need to specify a shadow in the XML.
        if (shadowType) {
          context.inputList.push(`<shadow type="${xmlEscape(shadowType)}">`);
        }

        // A <field> displays a dynamic value: a user-editable text field, a drop-down menu, etc.
        // Leave out the field if defaultValue or fieldName are not specified
        if (defaultValue !== null && fieldName) {
          context.inputList.push(`<field name="${xmlEscape(fieldName)}">${xmlEscape(defaultValue)}</field>`);
        }

        if (shadowType) {
          context.inputList.push('</shadow>');
        }

        if (valueName) {
          context.inputList.push('</value>');
        }
        

        const argsName = `args${context.outLineNum}`;
        const blockArgs = (context.blockJSON[argsName] = context.blockJSON[argsName] || []);
        if (argJSON) blockArgs.push(argJSON);
        const argNum = blockArgs.length;
        context.argsMap[placeholder] = argNum;

        return `%${argNum}`;
      },
    });

    // ============= ScratchBlocks part =============
    // reference: https://github.com/TurboWarp/scratch-blocks/pull/13/files

    patcher.patch(Blockly.FieldTextDropdown.prototype, 'init', {
      after: function() {
        if (!this.sourceBlock_.isShadow()) {
          // 使用浅色arrow
          this.arrow_.setAttributeNS('http://www.w3.org/1999/xlink',
            'xlink:href', Blockly.mainWorkspace.options.pathToMedia + 'dropdown-arrow.svg');
        }
      },
    });

    /**
     * Horizontal distance that a checkmark overhangs the dropdown.
     */
    Blockly.FieldTextDropdown.CHECKMARK_OVERHANG = Blockly.FieldDropdown.CHECKMARK_OVERHANG;

    /**
     * Mouse cursor style when over the hotspot that initiates the editor.
     */
    Blockly.FieldTextDropdown.prototype.CURSOR = Blockly.FieldTextInput.prototype.CURSOR;

    // NOTE: 不确定这么做有没有副作用
    // 这里的作用是，textDropDown在setText(手动输入时)，同步修改下拉菜单的value_值
    patcher.patch(Blockly.FieldTextInput.prototype, 'setText', {
      after: function(res, newValue) {
        if (Object.prototype.hasOwnProperty.call(this, 'value_') && typeof newValue === 'string') {
          this.value_ = newValue;
        }
      },
    });

    /**
     * Closure menu item currently selected.
     * @type {?goog.ui.MenuItem}
     */
    Blockly.FieldTextDropdown.prototype.selectedItem = Blockly.FieldDropdown.prototype.selectedItem;

    /**
     * Language-neutral currently selected string or image object.
     * @type {string|!Object}
     * @private
     */
    Blockly.FieldTextDropdown.prototype.value_ = Blockly.FieldDropdown.prototype.value_;

    // /**
    //  * Callback when the drop-down menu is hidden.
    //  */
    // Blockly.FieldTextDropdown.prototype.onHide = Blockly.FieldDropdown.prototype.onHide;

    /**
     * Handle the selection of an item in the dropdown menu.
     * @param {!goog.ui.Menu} menu The Menu component clicked.
     * @param {!goog.ui.MenuItem} menuItem The MenuItem selected within menu.
     */
    Blockly.FieldTextDropdown.prototype.onItemSelected = Blockly.FieldDropdown.prototype.onItemSelected;

    // - Blockly.FieldTextDropdown.prototype.getOptions_ = Blockly.FieldDropdown.prototype.getOptions_;
    Blockly.FieldTextDropdown.prototype.getOptions = Blockly.FieldDropdown.prototype.getOptions;

    /**
     * Get the language-neutral value from this dropdown menu.
     * @return {string} Current text.
     */
    Blockly.FieldTextDropdown.prototype.getValue = Blockly.FieldDropdown.prototype.getValue;

    /**
     * Set the language-neutral value for this dropdown menu.
     * @param {string} newValue New value to set.
     */
    Blockly.FieldTextDropdown.prototype.setValue = Blockly.FieldDropdown.prototype.setValue;
    Blockly.FieldTextDropdown.prototype.isEqual = Blockly.FieldDropdown.prototype.isEqual;

    /**
     * @return {boolean} True if the option list is generated by a function.
     *     Otherwise false.
     */
    Blockly.FieldTextDropdown.prototype.isOptionListDynamic = Blockly.FieldDropdown.prototype.isOptionListDynamic;

    // /**
    //  * Close the input widget if this input is being deleted.
    //  */
    // Blockly.FieldTextDropdown.prototype.dispose = function() {
    //   if (this.mouseUpWrapper_) {
    //     Blockly.unbindEvent_(this.mouseUpWrapper_);
    //     this.mouseUpWrapper_ = null;
    //     Blockly.Touch.clearTouchIdentifier();
    //   }
    //   Blockly.FieldTextDropdown.superClass_.dispose.call(this);
    // };
    // Blockly.Field.register('field_textdropdown', Blockly.FieldTextDropdown);
  }
  
// #endregion
// --------------- END src/utils/textDropDowns.js --------------- 

  // #region --------------- START: src/dollyPro/extension.js --------------- 


  const { Scratch: Scratch$1 } = window;
  const { BlockType, ArgumentType, TargetType, Cast } = Scratch$1;
  const recommendKeysRecords = new WeakMap();
  const recommendKeySymbol = Symbol('recommendKey');

  const Blockly = getScratchBlocks();

  !!Scratch$1.vm.runtime.gandi;

  const hasOwn = Object.prototype.hasOwnProperty;

  class DollyProExtension {
    static extCount = 0;

    constructor(runtime) {
      this.runtime = runtime;
      supportXMLBlockType(BlockType, runtime);
      patchTextDropDowns(runtime);

      DollyProExtension.extCount += 1;
      /** 递增计数的扩展id。预防一个奇妙的情况：扩展被重复加载） */
      this.id = DollyProExtension.extCount;

      /** 克隆体ID映射表：ID → target
       * @type {{[ID: string]: Target}}
       */
      this.IDtoTargets = {};

      this.nextSpriteIDCount = 0;
      this.nextCloneIDCount = 0;

      /** 刚克隆的克隆体ID
       * @type {string}
       */
      this.justCreatedCloneID = '';

      /** 克隆体分组，每个组是一个克隆体ID列表
       * @type {{[groupName: string]: string[]}}
       */
      this.groupsOfClones = {};

      /** 存放 forEach 积木当前遍历的克隆体ID
       * @type {{[topBlockId: string]: string}}
       */
      this.forEachIndex = {};

      /** 一个附加功能，将扩展中对原版xy方向的访问转移到对克隆体Key数据的访问
       * - 例如，x: 'x' 表示原来访问target.x，现在访问target.DollyPro.extraData['x']
       * - 默认都是 null，即访问原内容
       * @type {{x: string|null, y: string|null, direction: string|null}}
       */
      this.accessTransfer = { x: null, y: null, direction: null };

      /** 是否隐藏不常用的多莉积木
       * @type {boolean}
       */
      this.hideExtraBlocks = true;

      this.configSaver = new ConfigSaver(this.runtime, extensionId, {
        commentId: EXT_CONFIG_COMMENT_ID,
        // extName: 'DollyPro',
        // version: '1.0.0',
        // desc: '多莉积木',
      });

      if (!this.applyExtConfig()) {
        runtime.on('PROJECT_LOADED', () => {
          // 从作品注释读取扩展配置
          this.applyExtConfig();
        });
      }

      runtime.on('PROJECT_STOP_ALL', () => {
        // 停止作品，克隆体ID清0
        this.nextCloneIDCount = 0;
      });

      runtime.on('PROJECT_RUN_STOP', () => {
        // 清理没有任何克隆体的分组，直到分组数<=10（避免用户用随机ID产生的空分组堆积）
        const tagNames = Object.keys(this.groupsOfClones);
        let cnt = tagNames.length;
        for (let i = 0; i < tagNames.length; i++) {
          const tag = tagNames[i];
          if (this.groupsOfClones[tag].length === 0) {
            delete this.groupsOfClones[tag];
            cnt --;
            if (cnt <= 10) break;
          }
        }
      });

      /** Scratch 的 canvas 对象 */
      this.canvas = runtime.renderer.canvas;


      this.patcher = new Patcher(extensionId, {
        patchOwner: true,
      });

      const extIns = this;
      // 劫持 runtime.getTargetById (根据Id找克隆体时，先从ID表查找)
      this.patcher.patch(this.runtime, 'getTargetById', {
        before: (ID) => {
          // 先从ID表查找
          if (hasOwn.call(extIns.IDtoTargets, ID)) {
            return extIns.IDtoTargets[ID];
          }
        }
      });

      this.patcher.patch(this.runtime, '_pushThread', {
        after: (thread) => {
          if (thread.updateMonitor || thread.stackClick) return;
          const block = thread.blockContainer?.getBlock(thread.topBlock);
          // 如果启动的是“克隆体被删除”帽子，则立即执行
          if (block?.opcode === `${extensionId}_beforeDeletionOfTheClone`) {
            if (thread.isCompiled) {
              // 编译模式，使用这个标记使得 thread 会被立即执行
              thread.executableHat = true;
            }
          }
        }
      });

      // runtime.on('targetWasRemoved', (target) => {
      //   // removeExecutable（删除角色/克隆体）之前，处理一下后事
      //   extIns.onTargetDeleted(target);
      // });

      // 劫持 runtime.disposeTarget
      this.patcher.patch(this.runtime, 'disposeTarget', {
        before: (target) => {
        // 避免循环删除
          if (target.DollyPro?.isDeleting) return null;
        }
      });

      // 给每个角色注入多莉
      setTimeout(() => {
        const { targets } = this.runtime;
        if (targets) {
          if (targets[0]) {
            this.patchRenderTarget(targets[0]);
          }
          targets.forEach((target) => {
            // 注入多莉
            this.injectDollyTarget(target);
          });
        }
      }, 1000);

      // 创建新角色/克隆体时，注入多莉
      this.patcher.patch(this.runtime, 'addTarget', {
        before: (target, curThread) => {
          extIns.injectDollyTarget(target);
          if (!target.isOriginal) {
            // 如果是克隆体，进行一些预处理（如读取预设数据）
            extIns.onCloneCreated(target, curThread);
          }
        }
      });

      this.initFormatMessage(l10n$1);
    }

    initFormatMessage(l10n) {
      // 给l10n数据增加扩展id前缀
      const res = {};
      Object.entries(l10n).forEach(([lanKey, lan]) => {
        const curLan = {};
        res[lanKey] = curLan;
        Object.keys(lan).forEach((key) => {
          curLan[`witCat.dollyPro.${key}`] = lan[key];
        });
      });
      const fm = setupTranslation(res);
      // 创建fm函数
      this.formatMessage = (id) => {
        const newid = `witCat.dollyPro.${id}`;
        return fm({
          newid,
          default: newid,
          description: newid,
        });
      };
    }

    getHats() {
      return {
        [`${extensionId}_dispatchWhenCloned`]: {},
        [`${extensionId}_dispatchWhenCloneDeleted`]: {},
        [`${extensionId}_initTheClone`]: {},
        [`${extensionId}_beforeDeletionOfTheClone`]: {},
        [`${extensionId}_receiveMyBroadcast`]: {},
      };
    }

    getInfo() {
      let curTarget = this.runtime.getEditingTarget();
      if (curTarget?.isStage) {
        curTarget = this.runtime.targets[1];
      }
      const curTargetName = curTarget?.sprite?.name ?? '';
      const cloneAndDeleteBlocks = [
        // `---${this.formatMessage('tag.cloneAndDelete')}`,
        {
          blockType: BlockType.LABEL,
          text: this.formatMessage('tag.cloneAndDelete'),
        },
        // 预设克隆体 x/y/方向...
        {
          opcode: 'presetPropertyForTheNextClone',
          blockType: BlockType.COMMAND,
          text: this.formatMessage('block.presetPropertyForTheNextClone'),
          arguments: {
            PROPERTY: {
              type: ArgumentType.STRING,
              menu: 'PRESET_PROPERTY',
              defaultValue: 'x',
            },
            VALUE: {
              type: ArgumentType.STRING,
              defaultValue: '30',
            },
          },
        },
        // 预设克隆体单条key数据
        {
          opcode: 'presetSingleDataForTheNextClone',
          blockType: BlockType.COMMAND,
          text: this.formatMessage('block.presetSingleDataForTheNextClone'),
          arguments: {
            KEY: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.HP'),
            },
            VALUE: {
              type: ArgumentType.STRING,
              defaultValue: '100',
            },
          },
        },
        // 预设克隆体私有变量
        {
          opcode: 'presetVarForTheNextClone',
          blockType: BlockType.COMMAND,
          text: this.formatMessage('block.presetVarForTheNextClone'),
          arguments: {
            VAR: {
              type: ArgumentType.STRING,
              menu: 'ALL_PRIVATE_VARS',
            },
            VALUE: {
              type: ArgumentType.STRING,
              defaultValue: '100',
            },
          },
        },
        // 预设克隆体数据JSON
        {
          opcode: 'presetDataforTheNextCloneInJSONFormat',
          blockType: BlockType.COMMAND,
          hideFromPalette: this.hideExtraBlocks,
          text: this.formatMessage('block.presetDataforTheNextCloneInJSONFormat'),
          arguments: {
            DATA_JSON: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.presetJSON'),
            },
          },
        },
        // 预设克隆体分组
        {
          opcode: 'presetGroupForTheNextClone',
          blockType: BlockType.COMMAND,
          // hideFromPalette: this.hideExtraBlocks,
          text: this.formatMessage('block.presetGroupForTheNextClone'),
          arguments: {
            GROUP: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.enemy'),
              menu: 'RECOMMEND_TAG_MENU',
            },
          },
        },
        '---',
        {
          opcode: 'control_create_clone_of',
          blockType: Scratch$1.BlockType.XML,
          xml:
            '<block type="control_create_clone_of" id="control_create_clone_of">' +
            '<value name="CLONE_OPTION"><shadow type="control_create_clone_of_menu"></shadow></value>' +
            '</block>',
        },
        // 克隆并指定ID
        {
          opcode: 'createCloneAndSpecifyID',
          blockType: BlockType.COMMAND,
          text: this.formatMessage('block.createCloneAndSpecifyID'),
          hideFromPalette: true,
          arguments: {
            TARGET: {
              type: ArgumentType.STRING,
              menu: 'SPRITE_MENU_WITH_MYSELF',
            },
            ID: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.customID'),
            },
          },
        },
        // 克隆并指定一个数据
        {
          opcode: 'createCloneAndSpecifyData',
          blockType: BlockType.COMMAND,
          text: this.formatMessage('block.createCloneAndSpecifyData'),
          hideFromPalette: true,
          arguments: {
            TARGET: {
              type: ArgumentType.STRING,
              menu: 'SPRITE_MENU_WITH_MYSELF',
            },
            KEY: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.NO'),
            },
            VALUE: {
              type: ArgumentType.STRING,
              defaultValue: '1',
            },
          },
        },
        {
          opcode: 'createCloneAndSpecifyID',
          blockType: Scratch$1.BlockType.XML,
          xml:
            `<block type="${extensionId}_createCloneAndSpecifyID">` +
            '<value name="TARGET">' +
            '<shadow type="control_create_clone_of_menu"></shadow>' +
            '</value>' +
            '<value name="ID">' +
            '<shadow type="text">' +
            `<field name="TEXT">${this.formatMessage('defaultValue.customID')}</field>` +
            '</shadow>' +
            '</value>' +
            '</block>',
        },
        {
          opcode: 'createCloneAndSpecifyData',
          blockType: Scratch$1.BlockType.XML,
          xml:
            `<block type="${extensionId}_createCloneAndSpecifyData">` +
            '<value name="TARGET">' +
            '<shadow type="control_create_clone_of_menu"></shadow>' +
            '</value>' +
            '<value name="KEY">' +
            '<shadow type="text">' +
            `<field name="TEXT">${this.formatMessage('defaultValue.NO')}</field>` +
            '</shadow>' +
            '</value>' +
            '<value name="VALUE">' +
            '<shadow type="text">' +
            '<field name="TEXT">1</field>' +
            '</shadow>' +
            '</value>' +
            '</block>',
        },
        // 获取刚刚产生的克隆体的ID
        {
          opcode: 'getJustCreatedCloneID',
          blockType: BlockType.REPORTER,
          disableMonitor: true,
          text: this.formatMessage('block.getJustCreatedCloneID'),
        },
        '---',
        {
          opcode: 'deleteCloneByID',
          blockType: BlockType.COMMAND,
          text: this.formatMessage('block.deleteCloneByID'),
          arguments: {
            ID: {
              type: ArgumentType.STRING,
              defaultValue: 'ID',
            },
          },
        },
        {
          opcode: 'control_delete_this_clone',
          blockType: Scratch$1.BlockType.XML,
          filter: [TargetType.SPRITE],
          xml: '<block type="control_delete_this_clone" id="control_delete_this_clone"></block>',
        },
      ];
      const eventBlocks = [
        // `---${this.formatMessage('tag.event')}`,
        {
          blockType: BlockType.LABEL,
          text: this.formatMessage('tag.event'),
        },
        // 克隆体启动前执行的动作
        {
          blockType: BlockType.EVENT,
          opcode: 'initTheClone',
          filter: [TargetType.SPRITE],
          hideFromPalette: this.hideExtraBlocks,
          text: this.formatMessage('block.initTheClone'),
          isEdgeActivated: false,
        },
        {
          opcode: 'control_start_as_clone',
          blockType: Scratch$1.BlockType.XML,
          filter: [TargetType.SPRITE],
          xml: '<block type="control_start_as_clone" id="control_start_as_clone"></block>',
        },
        // 克隆体删除前执行动作
        {
          blockType: BlockType.EVENT,
          opcode: 'beforeDeletionOfTheClone',
          filter: [TargetType.SPRITE],
          // hideFromPalette: this.hideExtraBlocks,
          text: this.formatMessage('block.beforeDeletionOfTheClone'),
          isEdgeActivated: false,
        },
        // 当有克隆体被克隆
        {
          opcode: 'dispatchWhenCloned',
          blockType: BlockType.HAT,
          isEdgeActivated: false,
          hideFromPalette: this.hideExtraBlocks,
          text: this.formatMessage('block.dispatchWhenCloned'),
          arguments: {
            TARGET: {
              type: ArgumentType.STRING,
              menu: 'SPRITE_MENU_WITH_ANY',
            },
            ID: {
              type: 'ccw_hat_parameter',
            },
          },
        },
        // 当有克隆体被删除
        {
          opcode: 'dispatchWhenCloneDeleted',
          blockType: BlockType.HAT,
          isEdgeActivated: false,
          hideFromPalette: this.hideExtraBlocks,
          text: this.formatMessage('block.dispatchWhenCloneDeleted'),
          arguments: {
            TARGET: {
              type: ArgumentType.STRING,
              menu: 'SPRITE_MENU_WITH_ANY',
            },
            ID: {
              type: 'ccw_hat_parameter',
            },
          },
        },
        '---',
        // 朝特定克隆体广播
        {
          opcode: 'broadcastToClone',
          blockType: BlockType.COMMAND,
          text: this.formatMessage('block.broadcastToClone'),
          arguments: {
            MENU: {
              type: ArgumentType.STRING,
              menu: 'SPRITE_OR_GROUP_OR_ID_MENU',
            },
            VALUE: {
              type: ArgumentType.STRING,
              defaultValue: 'ID', // this.formatMessage('defaultValue.enemy'),
              menu: 'SPRITE_OR_GROUP_OR_ID_MENU_RECOMMEND',
            },
            MSG: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.MSGName'),
            },
            data: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.MSGInfo'),
            },
          },
        },
        // 当我收到私有广播
        {
          opcode: 'receiveMyBroadcast',
          blockType: BlockType.HAT,
          isEdgeActivated: false,
          shouldRestartExistingThreads: false,
          text: this.formatMessage('block.receiveMyBroadcast'),
          arguments: {
            MSG: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.MSGName'),
            },
            data: {
              type: 'ccw_hat_parameter',
            },
            senderID: {
              type: 'ccw_hat_parameter',
            },
          },
        },
      ];
      const dataBlocks = [
        // `---${this.formatMessage('tag.data')}`,
        {
          blockType: BlockType.LABEL,
          text: this.formatMessage('tag.data'),
        },
        // 读取我的信息：ID/x坐标/y坐标...
        {
          opcode: 'getMyProperty',
          blockType: BlockType.REPORTER,
          disableMonitor: true,
          hideFromPalette: true,
          text: this.formatMessage('block.getMyProperty'),
          arguments: {
            PROPERTY: {
              type: ArgumentType.STRING,
              menu: 'SPRITE_PROPERTY',
            },
          },
        },
        // 当前角色ID
        {
          opcode: 'myID',
          blockType: BlockType.REPORTER,
          disableMonitor: true,
          text: this.formatMessage('block.myID'),
        },
        // // 所属角色名
        // {
        //   opcode: 'mySpriteName',
        //   blockType: BlockType.REPORTER,
        //   disableMonitor: true,
        //   text: this.formatMessage('block.mySpriteName'),
        // },
        // 所属角色ID
        // {
        //   opcode: 'mySpriteID',
        //   blockType: BlockType.REPORTER,
        //   disableMonitor: true,
        //   text: this.formatMessage('block.mySpriteID'),
        // },
        // 角色ID
        {
          opcode: 'spriteID',
          blockType: BlockType.REPORTER,
          disableMonitor: true,
          text: this.formatMessage('block.spriteID'),
          arguments: {
            TARGET: {
              type: ArgumentType.STRING,
              menu: 'NEW_SPRITE_MENU',
              defaultValue: curTargetName,
            },
          },
        },
        {
          opcode: 'searchCloneWithKV',
          blockType: BlockType.REPORTER,
          disableMonitor: true,
          text: this.formatMessage('block.searchCloneWithKV'),
          arguments: {
            SPRITE: {
              type: ArgumentType.STRING,
              menu: 'NEW_SPRITE_MENU_WITH_ALL',
              defaultValue: curTargetName,
            },
            KEY: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.NO'),
            },
            VALUE: {
              type: ArgumentType.STRING,
              defaultValue: '1',
            },
          },
        },
        '---',
        // 读取我的多莉Key数据
        {
          opcode: 'getMyValueByKey',
          blockType: BlockType.REPORTER,
          text: this.formatMessage('block.getMyValueByKey'),
          arguments: {
            KEY: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.HP'),
            },
          },
        },
        // 设置我的多莉Key数据
        {
          opcode: 'setOrChangeMyValueWithKey',
          blockType: BlockType.COMMAND,
          text: this.formatMessage('block.setOrChangeMyValueWithKey'),
          arguments: {
            KEY: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.HP'),
            },
            OP: {
              type: ArgumentType.STRING,
              menu: 'DATA_OPEATION_MENU',
            },
            VALUE: {
              type: ArgumentType.STRING,
              defaultValue: '100',
            },
          },
        },
        '---',
        // 读取克隆体的多莉Key数据
        {
          opcode: 'getValueOfCloneIDWithKey',
          blockType: BlockType.REPORTER,
          text: this.formatMessage('block.getValueOfCloneIDWithKey'),
          arguments: {
            ID: {
              type: ArgumentType.STRING,
              defaultValue: 'ID',
            },
            KEY: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.HP'),
            },
          },
        },
        // 设置克隆体的多莉Key数据
        {
          opcode: 'setOrChangeValueOfCloneIDWithKey',
          blockType: BlockType.COMMAND,
          text: this.formatMessage('block.setOrChangeValueOfCloneIDWithKey'),
          arguments: {
            ID: {
              type: ArgumentType.STRING,
              defaultValue: 'ID',
            },
            KEY: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.HP'),
            },
            OP: {
              type: ArgumentType.STRING,
              menu: 'DATA_OPEATION_MENU',
            },
            VALUE: {
              type: ArgumentType.STRING,
              defaultValue: '100',
            },
          },
        },
        '---',
        // 读取克隆体的信息：ID/x坐标/y坐标...
        {
          opcode: 'getClonePropertyWithID',
          blockType: BlockType.REPORTER,
          text: this.formatMessage('block.getClonePropertyWithID'),
          arguments: {
            ID: {
              type: ArgumentType.STRING,
              defaultValue: 'ID',
            },
            PROPERTY: {
              type: ArgumentType.STRING,
              menu: 'SPRITE_PROPERTY',
              defaultValue: '_x',
            },
          },
        },
        // 设置克隆体的property
        {
          opcode: 'setCloneProperty',
          blockType: BlockType.COMMAND,
          text: this.formatMessage('block.setCloneProperty'),
          // hideFromPalette: this.hideExtraBlocks,
          arguments: {
            ID: {
              type: ArgumentType.STRING,
              defaultValue: 'ID',
            },
            PROPERTY: {
              type: ArgumentType.STRING,
              menu: 'PRESET_PROPERTY',
            },
            OP: {
              type: ArgumentType.STRING,
              menu: 'DATA_OPEATION_MENU',
            },
            VALUE: {
              type: ArgumentType.STRING,
              defaultValue: '100',
            },
          },
        },
        '---',
        // 读取克隆体的私有变量
        {
          opcode: 'getPrivateVarOfClone',
          blockType: BlockType.REPORTER,
          text: this.formatMessage('block.getPrivateVarOfClone'),
          arguments: {
            ID: {
              type: ArgumentType.STRING,
              defaultValue: 'ID',
            },
            VAR: {
              type: ArgumentType.STRING,
              menu: 'ALL_PRIVATE_VARS',
            },
          },
        },
        // 设置私有变量
        {
          opcode: 'setPrivateVarOfClone',
          blockType: BlockType.COMMAND,
          text: this.formatMessage('block.setPrivateVarOfClone'),
          arguments: {
            ID: {
              type: ArgumentType.STRING,
              defaultValue: 'ID',
            },
            VAR: {
              type: ArgumentType.STRING,
              menu: 'ALL_PRIVATE_VARS',
            },
            OP: {
              type: ArgumentType.STRING,
              menu: 'DATA_OPEATION_MENU',
            },
            VALUE: {
              type: ArgumentType.STRING,
              defaultValue: '100',
            },
          },
        },
      ];
      const tagBlocks = [
        // `---${this.formatMessage('tag.group')}`,
        {
          blockType: BlockType.LABEL,
          text: this.formatMessage('tag.group'),
        },
        // 删除[ID]的所有标签
        {
          opcode: 'removeAllTags',
          blockType: BlockType.COMMAND,
          text: this.formatMessage('block.removeAllTags'),
          arguments: {
            ID: {
              type: ArgumentType.STRING,
              defaultValue: 'ID',
            },
          },
        },
        // 将我加入/移出分组
        {
          opcode: 'addOrRemoveMyselfFromGroup',
          blockType: BlockType.COMMAND,
          filter: [TargetType.SPRITE],
          text: this.formatMessage('block.addOrRemoveMyselfFromGroup'),
          // hideFromPalette: this.hideExtraBlocks,
          arguments: {
            OP: {
              type: ArgumentType.STRING,
              menu: 'ADD_OR_REMOVE',
            },
            GROUP: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.enemy'),
              menu: 'RECOMMEND_TAG_MENU',
            },
          },
        },
        // 将克隆体加入/移出分组
        {
          opcode: 'addOrRemoveIDFromGroup',
          blockType: BlockType.COMMAND,
          text: this.formatMessage('block.addOrRemoveIDFromGroup'),
          arguments: {
            ID: {
              type: ArgumentType.STRING,
              defaultValue: 'ID',
            },
            OP: {
              type: ArgumentType.STRING,
              menu: 'ADD_OR_REMOVE',
            },
            GROUP: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.enemy'),
              menu: 'RECOMMEND_TAG_MENU',
            },
          },
        },
        // 克隆体在分组里吗？
        {
          opcode: 'ifCloneInGroup',
          blockType: BlockType.BOOLEAN,
          text: this.formatMessage('block.ifCloneInGroup'),
          arguments: {
            ID: {
              type: ArgumentType.STRING,
              defaultValue: 'ID',
            },
            GROUP: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.enemy'),
              menu: 'RECOMMEND_TAG_MENU',
            },
          },
        },
        // 获取某克隆体所有分组
        {
          opcode: 'getGroupsOfClone',
          blockType: BlockType.REPORTER,
          text: this.formatMessage('block.getGroupsOfClone'),
          hideFromPalette: this.hideExtraBlocks,
          arguments: {
            ID: {
              type: ArgumentType.STRING,
              defaultValue: 'ID',
            },
          },
        },
        '---',
        // 获取分组信息：克隆体数/ID表
        {
          opcode: 'getGroupInfo',
          blockType: BlockType.REPORTER,
          text: this.formatMessage('block.getGroupInfo'),
          arguments: {
            GROUP: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.enemy'),
              menu: 'RECOMMEND_TAG_MENU',
            },
            PROPERTY: {
              type: ArgumentType.STRING,
              menu: 'CLONE_PROPERTY',
            },
          },
        },
        // 获取分组中克隆体的ID/x/y/...
        {
          opcode: 'getClonePropertyInGroup',
          blockType: BlockType.REPORTER,
          text: this.formatMessage('block.getClonePropertyInGroup'),
          arguments: {
            GROUP: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.enemy'),
              menu: 'RECOMMEND_TAG_MENU',
            },
            INDEX: {
              type: ArgumentType.NUMBER,
              defaultValue: 1,
            },
            PROPERTY: {
              type: ArgumentType.STRING,
              menu: 'SPRITE_PROPERTY',
            },
          },
        },
        // 将分组中，克隆体的ID列表导入原版列表
        {
          opcode: 'importGroupIntoList',
          blockType: BlockType.COMMAND,
          text: this.formatMessage('block.importGroupIntoList'),
          hideFromPalette: this.hideExtraBlocks,
          arguments: {
            GROUP: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.enemy'),
              menu: 'RECOMMEND_TAG_MENU',
            },
            OP: {
              type: ArgumentType.STRING,
              menu: 'LIST_OP_MENU',
            },
            LIST: {
              type: ArgumentType.STRING,
              menu: 'LIST_MENU',
            },
          },
        },
        // 遍历分组的每个克隆体
        {
          opcode: 'forEachWithGroup',
          blockType: BlockType.CONDITIONAL,
          text: [this.formatMessage('block.forEachWithGroup')],
          branchCount: 1,
          hideFromPalette: this.hideExtraBlocks,
          arguments: {
            GROUP: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.enemy'),
              menu: 'RECOMMEND_TAG_MENU',
            },
          },
        },
        // 当前遍历的克隆体ID
        {
          opcode: 'cloneIDOfForEach',
          blockType: BlockType.REPORTER,
          hideFromPalette: this.hideExtraBlocks,
          text: this.formatMessage('block.cloneIDOfForEach'),
          disableMonitor: true,
        },
      ];
      const sensingBlocks = [
        // `---${this.formatMessage('tag.sensing')}`,
        {
          blockType: BlockType.LABEL,
          text: this.formatMessage('tag.sensing'),
        },
        // 获取分组..中最近克隆体ID
        {
          opcode: 'getNearestClone',
          blockType: BlockType.REPORTER,
          filter: [TargetType.SPRITE],
          text: this.formatMessage('block.getNearestClone'),
          arguments: {
            TYPE: {
              type: ArgumentType.STRING,
              menu: 'NEAREST_OR_FARTHEST',
            },
            MENU: {
              type: ArgumentType.STRING,
              menu: 'SPRITE_OR_GROUP_MENU',
            },
            VALUE: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.enemy'),
              menu: 'SPRITE_OR_GROUP_OR_ID_MENU_RECOMMEND',
            },
          },
        },
        {
          opcode: 'getNearestForID',
          blockType: BlockType.REPORTER,
          text: this.formatMessage('block.getNearestForID'),
          arguments: {
            ID: {
              type: ArgumentType.STRING,
              defaultValue: 'ID',
            },
            TYPE: {
              type: ArgumentType.STRING,
              menu: 'NEAREST_OR_FARTHEST',
            },
            MENU: {
              type: ArgumentType.STRING,
              menu: 'SPRITE_OR_GROUP_MENU',
            },
            VALUE: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.enemy'),
              menu: 'SPRITE_OR_GROUP_OR_ID_MENU_RECOMMEND',
            },
          },
        },
        // 获取碰到的克隆体ID
        {
          opcode: 'getTouchingID',
          blockType: BlockType.REPORTER,
          filter: [TargetType.SPRITE],
          text: this.formatMessage('block.getTouchingID'),
          arguments: {
            MENU: {
              type: ArgumentType.STRING,
              menu: 'SPRITE_OR_GROUP_MENU',
            },
            VALUE: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.enemy'),
              menu: 'SPRITE_OR_GROUP_OR_ID_MENU_RECOMMEND',
            },
            TYPE: {
              type: ArgumentType.STRING,
              menu: 'ONE_OR_ALL_MENU',
            },
          },
        },
        // 将碰到的克隆体ID导入列表
        {
          opcode: 'importTouchingIDsIntoList',
          blockType: BlockType.COMMAND,
          filter: [TargetType.SPRITE],
          text: this.formatMessage('block.importTouchingIDsIntoList'),
          hideFromPalette: this.hideExtraBlocks,
          arguments: {
            MENU: {
              type: ArgumentType.STRING,
              menu: 'SPRITE_OR_GROUP_MENU',
            },
            VALUE: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.enemy'),
              menu: 'SPRITE_OR_GROUP_OR_ID_MENU_RECOMMEND',
            },
            OP: {
              type: ArgumentType.STRING,
              menu: 'LIST_OP_MENU',
            },
            LIST: {
              type: ArgumentType.STRING,
              menu: 'LIST_MENU',
            },
          },
        },
        // 判断是否碰到克隆体
        {
          opcode: 'isTouchingClone',
          blockType: BlockType.BOOLEAN,
          filter: [TargetType.SPRITE],
          text: this.formatMessage('block.isTouchingClone'),
          arguments: {
            ID: {
              type: ArgumentType.STRING,
              defaultValue: 'ID',
            },
            MENU: {
              type: ArgumentType.STRING,
              menu: 'SPRITE_OR_GROUP_OR_ID_MENU',
            },
            VALUE: {
              type: ArgumentType.STRING,
              defaultValue: 'ID', // this.formatMessage('defaultValue.enemy'),
              menu: 'SPRITE_OR_GROUP_OR_ID_MENU_RECOMMEND',
            },
          },
        },
        // 克隆体是否碰到克隆体
        {
          opcode: 'isCloneTouchingClone',
          blockType: BlockType.BOOLEAN,
          text: this.formatMessage('block.isCloneTouchingClone'),
          // hideFromPalette: this.hideExtraBlocks,
          arguments: {
            ID: {
              type: ArgumentType.STRING,
              defaultValue: 'ID',
            },
            MENU: {
              type: ArgumentType.STRING,
              menu: 'SPRITE_OR_GROUP_OR_ID_MENU',
            },
            VALUE: {
              type: ArgumentType.STRING,
              defaultValue: 'ID2', // this.formatMessage('defaultValue.enemy'),
              menu: 'SPRITE_OR_GROUP_OR_ID_MENU_RECOMMEND',
            },
          },
        },
        // 判断克隆体是否碰到点xy
        {
          opcode: 'isCloneTouchingCoord',
          blockType: BlockType.BOOLEAN,
          // hideFromPalette: this.hideExtraBlocks,
          text: this.formatMessage('block.isCloneTouchingCoord'),
          arguments: {
            X: {
              type: ArgumentType.NUMBER,
              defaultValue: 114,
            },
            Y: {
              type: ArgumentType.NUMBER,
              defaultValue: 514,
            },
            MENU: {
              type: ArgumentType.STRING,
              menu: 'SPRITE_OR_GROUP_OR_ID_MENU',
            },
            VALUE: {
              type: ArgumentType.STRING,
              defaultValue: 'ID', // this.formatMessage('defaultValue.enemy'),
              menu: 'SPRITE_OR_GROUP_OR_ID_MENU_RECOMMEND',
            },
          },
        },
        // 点xy最顶层的克隆体/角色ID
        {
          opcode: 'pickTarget',
          blockType: BlockType.REPORTER,
          hideFromPalette: this.hideExtraBlocks,
          text: this.formatMessage('block.pickTarget'),
          arguments: {
            X: {
              type: ArgumentType.NUMBER,
              defaultValue: 114,
            },
            Y: {
              type: ArgumentType.NUMBER,
              defaultValue: 514,
            },
          },
        },
      ];
      const motionBlock = [
        // `---${this.formatMessage('tag.motion')}`,
        {
          blockType: BlockType.LABEL,
          text: this.formatMessage('tag.motion'),
        },
        // 计算我到克隆体..的距离/方向/角度差/..
        {
          opcode: 'calcDistanceToClone',
          blockType: BlockType.REPORTER,
          filter: [TargetType.SPRITE],
          text: this.formatMessage('block.calcDistanceToClone'),
          arguments: {
            ID: {
              type: ArgumentType.STRING,
              defaultValue: 'ID',
            },
            MENU: {
              type: ArgumentType.STRING,
              menu: 'CALC_DIS_OR_DIR_MENU',
            },
          },
        },
        // 计算克隆体1到克隆体2的距离/方向/角度差/..
        {
          opcode: 'calcDistanceBetweenClones',
          blockType: BlockType.REPORTER,
          text: this.formatMessage('block.calcDistanceBetweenClones'),
          arguments: {
            ID1: {
              type: ArgumentType.STRING,
              defaultValue: 'ID1', // 'ID',
            },
            ID2: {
              type: ArgumentType.STRING,
              defaultValue: 'ID2', // this.formatMessage('defaultValue.enemy'),
            },
            MENU: {
              type: ArgumentType.STRING,
              menu: 'CALC_DIS_OR_DIR_MENU',
            },
          },
        },
        // 计算克隆体到点的距离/方向/角度差/..
        {
          opcode: 'infoBetweenCloneAndPoint',
          blockType: BlockType.REPORTER,
          text: this.formatMessage('block.infoBetweenCloneAndPoint'),
          arguments: {
            X: {
              type: ArgumentType.NUMBER,
              defaultValue: '0',
            },
            Y: {
              type: ArgumentType.NUMBER,
              defaultValue: '0',
            },
            ID: {
              type: ArgumentType.STRING,
              defaultValue: 'ID', // this.formatMessage('defaultValue.enemy'),
            },
            MENU: {
              type: ArgumentType.STRING,
              menu: 'CALC_DIS_OR_DIR_MENU',
            },
          },
        },
        // 移到/面向克隆体
        {
          opcode: 'moveToClone',
          blockType: BlockType.COMMAND,
          filter: [TargetType.SPRITE],
          text: this.formatMessage('block.moveToClone'),
          arguments: {
            MOTION: {
              type: ArgumentType.STRING,
              menu: 'MOVE_TO_OR_POINT_AT',
            },
            ID: {
              type: ArgumentType.STRING,
              defaultValue: 'ID',
            },
          },
        },
        // 朝克隆体移动/旋转
        {
          opcode: 'moveStepsToClone',
          blockType: BlockType.COMMAND,
          filter: [TargetType.SPRITE],
          text: this.formatMessage('block.moveStepsToClone'),
          arguments: {
            ID: {
              type: ArgumentType.STRING,
              defaultValue: 'ID',
            },
            MOTION: {
              type: ArgumentType.STRING,
              menu: 'MOVE_OR_ROTATE',
            },
            VALUE: {
              type: ArgumentType.NUMBER,
              defaultValue: 10,
            },
          },
        },
      ];
      const deprecatedBlocks = [
        // （旧积木：参数无法塞入圆形积木）获取角色的克隆体数量/ID表
        {
          opcode: 'getCloneTargetPropertyWithSpriteName',
          blockType: BlockType.REPORTER,
          hideFromPalette: true,
          text: this.formatMessage('block.getCloneTargetPropertyWithSpriteName'),
          arguments: {
            TARGET: {
              type: ArgumentType.STRING,
              menu: 'SPRITE_MENU_WITH_ALL',
            },
            PROPERTY: {
              type: ArgumentType.STRING,
              menu: 'CLONE_PROPERTY',
            },
          },
        },
      ];
      const blocks = [
        // `---${this.formatMessage('tag.utils')}`,
        {
          blockType: BlockType.LABEL,
          text: this.formatMessage('tag.utils'),
        },
        // 判断我是克隆体/本体吗
        {
          opcode: 'isCloneOrIsOriginal',
          blockType: BlockType.BOOLEAN,
          filter: [TargetType.SPRITE],
          text: this.formatMessage('block.isCloneOrIsOriginal'),
          disableMonitor:true,
          arguments: {
            TYPE: {
              type: ArgumentType.STRING,
              menu: 'CLONE_OR_ORIGINAL_MENU',
            },
          },
        },
        // （新积木：参数可以塞入圆形积木）获取角色的克隆体数量/ID表
        {
          opcode: 'getCloneTargetPropertyWithSpriteName2',
          blockType: BlockType.REPORTER,
          text: this.formatMessage('block.getCloneTargetPropertyWithSpriteName'),
          arguments: {
            TARGET: {
              type: ArgumentType.STRING,
              menu: 'NEW_SPRITE_MENU_WITH_ALL',
            },
            PROPERTY: {
              type: ArgumentType.STRING,
              menu: 'CLONE_PROPERTY',
            },
          },
        },
        // （旧积木：参数无法塞入圆形积木）获取角色ID等信息
        {
          opcode: 'getOriginalTargetPropertyWithSpriteName',
          blockType: BlockType.REPORTER,
          disableMonitor: true,
          hideFromPalette: true,
          text: this.formatMessage('block.getOriginalTargetPropertyWithSpriteName'),
          arguments: {
            TARGET: {
              type: ArgumentType.STRING,
              menu: 'SPRITE_MENU',
            },
            PROPERTY: {
              type: ArgumentType.STRING,
              menu: 'SPRITE_PROPERTY',
            },
          },
        },
        // （新积木：参数可以塞入圆形积木）获取角色ID等信息
        {
          opcode: 'getOriginalTargetPropertyWithSpriteName2',
          blockType: BlockType.REPORTER,
          disableMonitor: true,
          hideFromPalette: true,
          text: this.formatMessage('block.getOriginalTargetPropertyWithSpriteName'),
          arguments: {
            TARGET: {
              type: ArgumentType.STRING,
              menu: 'NEW_SPRITE_MENU',
            },
            PROPERTY: {
              type: ArgumentType.STRING,
              menu: 'SPRITE_PROPERTY',
            },
          },
        },
        // 克隆体存在？
        {
          opcode: 'ifCloneExists',
          blockType: BlockType.BOOLEAN,
          text: this.formatMessage('block.ifCloneExists'),
          arguments: {
            ID: {
              type: ArgumentType.STRING,
              defaultValue: 'ID',
            },
          },
        },
        ...cloneAndDeleteBlocks,
        ...eventBlocks,
        ...dataBlocks,
        ...tagBlocks,
        ...sensingBlocks,
        ...motionBlock,
        ...deprecatedBlocks,
        // 按钮：显示不常用积木
        {
          blockType: 'button',
          text: this.formatMessage(this.hideExtraBlocks ? 'button.showBlock' : 'button.hideBlock'),
          func:'onShowMoreClick',
        },
        // ...(this.hideExtraBlocks ? [] : [
        // ]),
        // `---${this.formatMessage('tag.test')}`
        {
          blockType: 'label',
          text: this.formatMessage('tag.test'),
          hideFromPalette: this.hideExtraBlocks,
        },
        // 修改我的ID
        {
          opcode: 'setMyID',
          blockType: BlockType.COMMAND,
          hideFromPalette: this.hideExtraBlocks,
          text: this.formatMessage('block.setMyID'),
          arguments: {
            ID: {
              type: ArgumentType.STRING,
              defaultValue: 'ID',
            },
          },
        },
        // 转移x/y/方向的访问
        {
          opcode: 'transferAccessToTargetXYToDollyDataKey',
          blockType: BlockType.COMMAND,
          hideFromPalette: this.hideExtraBlocks,
          text: this.formatMessage('block.transferAccessToTargetXYToDollyDataKey'),
          arguments: {
            X_NAME: {
              type: ArgumentType.STRING,
              defaultValue: 'x',
            },
            Y_NAME: {
              type: ArgumentType.STRING,
              defaultValue: 'y',
            },
            DIR_NAME: {
              type: ArgumentType.STRING,
              defaultValue: this.formatMessage('defaultValue.direction'),
            },
          },
        },
        // 取消x/y/方向的访问转移
        {
          opcode: 'cancelAccessTransfer',
          hideFromPalette: this.hideExtraBlocks,
          blockType: BlockType.COMMAND,
          text: this.formatMessage('block.cancelAccessTransfer'),
        },
        // {
        //   opcode: 'test',
        //   blockType: BlockType.REPORTER,
        //   text: 'test ID[ID]',
        //   hideFromPalette: true,
        //   arguments: {
        //     ID: {
        //       type: ArgumentType.STRING,
        //       defaultValue: 'ID',
        //     },
        //   },
        // },
      ];
      blocks.forEach((block) => {
        if (typeof block === 'object') {
          block.tooltip = this.formatMessage(`tooltip.${block.opcode}`);
          if (['calcDistanceToClone', 'calcDistanceBetweenClones', 'infoBetweenCloneAndPoint'].includes(block.opcode)) {
            const texts = block.tooltip.split('@');
            block.tooltip =
              texts[0] + this.formatMessage('tooltip.disOptions').replace(/%s1/g, texts[1]).replace(/%s2/g, texts[2]);
          }
        }
        // 添加小icon
        if (
          [
            BlockType.COMMAND,
            BlockType.REPORTER,
            BlockType.BOOLEAN,
            BlockType.EVENT,
            BlockType.HAT,
            BlockType.CONDITIONAL,
          ].includes(block.blockType)
        ) {
          block.text = `[IMG]${block.text}`;
          if (!block.arguments) block.arguments = {};
          block.arguments.IMG = {
            type: Scratch$1.ArgumentType.IMAGE,
            dataURI: icon,
          };
        }
      });
      return {
        id: extensionId,
        name: this.formatMessage('name'),
        menuIconURI: icon,
        // blockIconURI: icon,
        color1: '#FF9922', // '#fc9e2b', // '#FF9922',
        docsURI: this.formatMessage('url'),
        blocks,
        menus: {
          RECOMMEND_KEY_MENU: {
            acceptText: true,
            acceptReporters: true,
            items: 'getRecommendKeyMenu'
          },
          RECOMMEND_TAG_MENU: {
            acceptText: true,
            acceptReporters: true,
            items: 'getRecommendTagMenu'
          },
          RECOMMEND_ID_MENU: {
            acceptText: true,
            acceptReporters: true,
            items: 'getRecommendIDMenu'
          },
          NEAREST_OR_FARTHEST: {
            items: [
              {
                text: this.formatMessage('menu.nearest'),
                value: 'nearest',
              },
              {
                text: this.formatMessage('menu.farthest'),
                value: 'farthest',
              },
            ],
          },
          MOVE_OR_ROTATE: {
            items: [
              {
                text: this.formatMessage('menu.miton.rotateDegrees'),
                value: 'rotate',
              },
              {
                text: this.formatMessage('menu.miton.moveSteps'),
                value: 'move',
              },
            ],
          },
          MOVE_TO_OR_POINT_AT: {
            items: [
              {
                text: this.formatMessage('menu.miton.PointAt'),
                value: 'pointAt',
              },
              {
                text: this.formatMessage('menu.miton.moveTo'),
                value: 'moveTo',
              },
            ],
          },
          CALC_DIS_OR_DIR_MENU: {
            items: [
              {
                text: this.formatMessage('menu.calcBetweenClones.distance'),
                value: 'dis',
              },
              {
                text: this.formatMessage('menu.calcBetweenClones.direction'),
                value: 'dir',
              },
              {
                text: this.formatMessage('menu.calcBetweenClones.angleDifference'),
                value: 'angle',
              },
              {
                text: this.formatMessage('menu.calcBetweenClones.absAngleDifference'),
                value: 'absAngle',
              },
            ],
          },
          ADD_OR_REMOVE: {
            items: [
              {
                text: this.formatMessage('menu.addOrRemove.add'),
                value: 'add',
              },
              {
                text: this.formatMessage('menu.addOrRemove.remove'),
                value: 'remove',
              },
            ],
          },
          ONE_OR_ALL_MENU: {
            items: [
              {
                text: this.formatMessage('menu.oneOrAll.one'),
                value: 'one',
              },
              {
                text: this.formatMessage('menu.oneOrAll.all'),
                value: 'all',
              },
            ],
          },
          SPRITE_OR_GROUP_OR_ID_MENU_RECOMMEND: {
            acceptText: true,
            acceptReporters: true,
            items: 'getRecommendSpriteOrGroupOrIDMenu',
          },
          SPRITE_OR_GROUP_OR_ID_MENU: {
            items: [
              { text: this.formatMessage('menu.targetType.ID'), value: 'ID' },
              { text: this.formatMessage('menu.targetType.group'), value: 'group' },
              { text: this.formatMessage('menu.targetType.IDlist'), value: 'IDlist' },
              // { text: this.formatMessage('menu.targetType.sprite'), value: 'sprite' }, // 历史选项
              { text: this.formatMessage('menu.targetType.spriteClone'), value: 'spriteClone' },
              { text: this.formatMessage('menu.targetType.spriteOnly'), value: 'spriteOnly' },
              { text: this.formatMessage('menu.targetType.cloneOnly'), value: 'cloneOnly' },
            ],
          },
          SPRITE_OR_GROUP_MENU: {
            items: [
              { text: this.formatMessage('menu.targetType.group'), value: 'group' },
              { text: this.formatMessage('menu.targetType.IDlist'), value: 'IDlist' },
              // { text: this.formatMessage('menu.targetType.sprite'), value: 'sprite' },
              { text: this.formatMessage('menu.targetType.spriteClone'), value: 'spriteClone' },
              { text: this.formatMessage('menu.targetType.spriteOnly'), value: 'spriteOnly' },
              { text: this.formatMessage('menu.targetType.cloneOnly'), value: 'cloneOnly' },
            ],
          },
          LIST_OP_MENU: {
            items: [
              {
                text: this.formatMessage('menu.listop.replace'),
                value: 'replace',
              },
              {
                text: this.formatMessage('menu.listop.insert'),
                value: 'insert',
              },
            ],
          },
          CLONE_OR_ORIGINAL_MENU: {
            items: [
              {
                text: this.formatMessage('menu.type.clone'),
                value: 'clone',
              },
              {
                text: this.formatMessage('menu.type.original'),
                value: 'original',
              },
            ],
          },
          ALL_PRIVATE_VARS: {
            acceptReporters: true,
            items: 'getPrivateVarsMenu',
          },
          DATA_OPEATION_MENU: {
            items: [
              {
                text: this.formatMessage('menu.dataop.set'),
                value: 'set',
              },
              {
                text: this.formatMessage('menu.dataop.change'),
                value: 'change',
              },
            ],
          },
          SPRITE_MENU: {
            acceptReporters: false,
            items: 'spriteMenuWithMainSprite',
          },
          SPRITE_MENU_WITH_ALL: {
            acceptReporters: false,
            items: 'spriteMenuWithAll',
          },
          // 这两个菜单换成可以接受reporters
          NEW_SPRITE_MENU: {
            acceptReporters: true,
            items: 'spriteMenuWithMainSprite',
          },
          NEW_SPRITE_MENU_WITH_ALL: {
            acceptReporters: true,
            items: 'spriteMenuWithAll',
          },

          SPRITE_MENU_WITH_ANY: {
            acceptReporters: false,
            items: 'spriteMenuWithAny',
          },
          SPRITE_MENU_WITH_MYSELF: {
            acceptReporters: true,
            items: 'spriteMenuWithMyself',
          },

          LIST_MENU: {
            acceptReporters: false,
            items: 'listMenu',
          },
          PRESET_PROPERTY: {
            acceptReporters: false,
            items: [
              {
                text: this.formatMessage('menu.spriteProperty._x'),
                value: 'x',
              },
              {
                text: this.formatMessage('menu.spriteProperty._y'),
                value: 'y',
              },
              {
                text: this.formatMessage('menu.spriteProperty._size'),
                value: 'size',
              },
              {
                text: this.formatMessage('menu.spriteProperty._visible'),
                value: 'visible',
              },
              {
                text: this.formatMessage('menu.spriteProperty.direction'),
                value: 'direction',
              },
              {
                text: this.formatMessage('menu.spriteProperty.currentCostumeName'),
                value: 'currentCostumeName',
              },
              {
                text: this.formatMessage('menu.color'),
                value: 'color',
              },
              {
                text: this.formatMessage('menu.fisheye'),
                value: 'fisheye',
              },
              {
                text: this.formatMessage('menu.whirl'),
                value: 'whirl',
              },
              {
                text: this.formatMessage('menu.pixelate'),
                value: 'pixelate',
              },
              {
                text: this.formatMessage('menu.mosaic'),
                value: 'mosaic',
              },
              {
                text: this.formatMessage('menu.brightness'),
                value: 'brightness',
              },
              {
                text: this.formatMessage('menu.ghost'),
                value: 'ghost',
              },
              {
                text: this.formatMessage('menu.spriteProperty.dataJSON'),
                value: 'dataJSON',
              },
            ],
          },
          SPRITE_PROPERTY: {
            items: 'spritePropertiesMenu',
          },
          CLONE_PROPERTY: {
            items: [
              {
                text: this.formatMessage('menu.cloneProperty.count'),
                value: 'count',
              },
              // {
              //   text: this.formatMessage('menu.cloneProperty.json'),
              //   value: 'json',
              // },
              {
                text: this.formatMessage('menu.cloneProperty.IDList'),
                value: 'IDList',
              },
            ],
          },
        },
      };
    }

    // ******************** ↓扩展配置读取&保存（参考了 tw 的通过注释来保存配置） ********************

    /** 从舞台注释应用扩展配置
     * @returns {boolean} 是否成功
     */
    applyExtConfig() {
      const config = this.configSaver.getConfig();
      if (!config) return false;
      if ('hideExtraBlocks' in config) {
        this.hideExtraBlocks = Cast.toBoolean(config.hideExtraBlocks);
        this.runtime.emit('TOOLBOX_EXTENSIONS_NEED_UPDATE');
      }
      return true;
    }

    storeExtConfig() {
      // 设置配置
      const config = this.configSaver.getConfig() || {};
      config.hideExtraBlocks = this.hideExtraBlocks;
      this.configSaver.storeConfig(config);
    }

    logWarn(...args) {
      (this.runtime.logSystem?.warn ?? console.warn)(` [${this.formatMessage('name')}] `, ...args);
    }

    logError(...args) {
      // 详情页不弹出警告（转Warn）
      if (this.runtime.isPlayerOnly) this.logWarn(...args);
      else if (this.runtime.logSystem) {
        this.runtime.logSystem.error(`[${this.formatMessage('name')}]`, ...args);
      } else console.error(`${this.formatMessage('name')}: `, ...args);
    }

    // #region **************************** 动态菜单 ****************************

    getRecommendIDMenu() {
      return [''];
      // let menu = Array.from(recommendID);
      // this.runtime.targets.forEach(target => {
      //   if (!target.isOriginal) return;
      //   const ID = this.getIDOfTarget(target);
      //   // const name = target.isStage ? this.formatMessage('stage') : target.sprite.name;
      //   menu.push({
      //     // text: `${ID}(${name})`,
      //     text: ID,
      //     value: ID,
      //   });
      // });
      // return menu;
    }

    getRecommendKeyMenu() {
      let menu = [];
      const target = this.runtime._editingTarget;
      if (target) {
        let record = recommendKeysRecords.get(target.sprite);
        if (!record) {
          record = new Set();
        }
        menu = Array.from(record);
      }
      if (menu.length === 0) {
        menu = [{text: '-', value: ''}]; // 空
      }
      return menu;
    }

    getPlainSpriteMenu() {
      const res = this.runtime.targets.filter(target => target.isOriginal && !target.isStage).map(target => {
        const name = target.sprite.name;
        return ({
          text: name,
          value: name,
        });
      });
      if (res.length === 0) {
        return [{text: '-', value: ''}]; // 空
      }
      return res;
    }

    getRecommendTagMenu() {
      const res = Object.keys(this.groupsOfClones);
      if (res.length === 0) {
        return [{text: '-', value: ''}]; // 空
      }
      return res;
    }

    getRecommendSpriteOrGroupOrIDMenu() {
      const type = this.getFieldText(null, 'MENU');
      let menu = [];
      switch(type) {
        case 'ID':
          menu = this.getRecommendIDMenu();
          break;
        case 'group':
          menu = this.getRecommendTagMenu();
          break;
        case 'IDlist':
          menu = ['["ID1", "ID2"]'];
          break;
        default:
          // 角色
          // menu = this.getPlainSpriteMenu();
          menu = this.spriteMenuWithMyself();
          break;
      }
      if (menu.length === 0) {
        menu = [{text: '-', value: ''}]; // 空
      }
      return menu;
    }

    spritePropertiesMenu() {
      const menu = [
        {
          text: this.formatMessage('menu.spriteProperty.id'),
          value: 'id',
        },
        {
          text: this.formatMessage('menu.spriteProperty._x'),
          value: '_x',
        },
        {
          text: this.formatMessage('menu.spriteProperty._y'),
          value: '_y',
        },
        {
          text: this.formatMessage('menu.spriteProperty.name'),
          value: 'name',
        },
        {
          text: this.formatMessage('menu.spriteProperty._size'),
          value: '_size',
        },
        {
          text: this.formatMessage('menu.spriteProperty._visible'),
          value: '_visible',
        },
        {
          text: this.formatMessage('menu.spriteProperty.direction'),
          value: 'direction',
        },
        {
          text: this.formatMessage('menu.spriteProperty.currentCostume'),
          value: 'currentCostume',
        },
        {
          text: this.formatMessage('menu.spriteProperty.currentCostumeName'),
          value: 'currentCostumeName',
        },
        {
          text: this.formatMessage('menu.spriteProperty.dataJSON'),
          value: 'dataJSON',
        },
        {
          text: this.formatMessage('menu.color'),
          value: 'color',
        },
        {
          text: this.formatMessage('menu.fisheye'),
          value: 'fisheye',
        },
        {
          text: this.formatMessage('menu.whirl'),
          value: 'whirl',
        },
        {
          text: this.formatMessage('menu.pixelate'),
          value: 'pixelate',
        },
        {
          text: this.formatMessage('menu.mosaic'),
          value: 'mosaic',
        },
        {
          text: this.formatMessage('menu.brightness'),
          value: 'brightness',
        },
        {
          text: this.formatMessage('menu.ghost'),
          value: 'ghost',
        },
      ];
      // 和高级数据结构联动（获取存放克隆体KV数据的对象）
      if (this.runtime.SafeObject) {
        menu.push({
          text: this.formatMessage('menu.spriteProperty.extraDataObj'),
          value: 'dataObj',
        });
      }
      return menu;
    }

    /**
     * 获取角色菜单
     * @returns {[{text: "角色名", value: "角色名"}]};
     */
    _getSpriteMenu(mySelfText = this.formatMessage('menu.curSprite')) {
      const { targets } = this.runtime;

      const menu = [];
      const editingTarget = this.runtime.getEditingTarget();
      targets.forEach((target) => {
        if (!target.isStage && target.isOriginal) {
          menu.push({
            text: target.sprite.name,
            value: target.sprite.name,
          });
        }
      });
      if (mySelfText && editingTarget && !editingTarget.isStage) {
        // 列表第一项插入“自己”
        menu.unshift({
          text: mySelfText,
          value: CONST.MYSELF,
        });
      }
      return menu;
    }

    /**
     * 角色菜单并检查是否为空
     * @returns {[{text: "角色名", value: "角色名"}]};
     */
    spriteMenuWithMainSprite() {
      const menu = this._getSpriteMenu(this.formatMessage('menu.curMainSprite'));
      if (menu.length === 0) {
        menu.push({
          text: '-',
          value: CONST.EMPTY,
        });
      }
      return menu;
    }

    /**
     * 角色菜单（但是多一项“所有”）
     * @returns {text: "角色名", value: "角色名"}[];
     */
    spriteMenuWithAll() {
      const menu = this._getSpriteMenu();
      menu.unshift({
        text: this.formatMessage('menu.cloneProperty.allSprite'),
        value: CONST.ALL,
      });
      return menu;
    }

    /**
     * 角色菜单（但是多一项“任意角色”）
     * @returns {text: "角色名", value: "角色名"}[];
     */
    spriteMenuWithAny() {
      const menu = this._getSpriteMenu();
      menu.unshift({
        text: this.formatMessage('menu.cloneProperty.anySprite'),
        value: CONST.ALL,
      });
      return menu;
    }

    /**
     * 角色菜单（但是多一项“自己”）
     * @returns {text: "角色名", value: "角色名"}[];
     */
    spriteMenuWithMyself() {
      const menu = this._getSpriteMenu(this.formatMessage('menu.cloneProperty.myself'));
      if (menu.length === 0) {
        menu.push({
          text: '-',
          value: CONST.EMPTY,
        });
      }
      return menu;
    }

    /**
     * 所有角色的私有变量的列表
     */
    getPrivateVarsMenu() {
      const menu = [];
      let curTarget = this.runtime.getEditingTarget();
      const getOneTargetVar = (target) => {
        const vars = [];
        Object.values(target.variables).forEach((variable) => {
          if (variable.type === 'list') return;
          let name;
          if (target === curTarget) {
            name = variable.name;
          } else name = `[${target.sprite.name}]: ${variable.name}`;
          vars.push({
            text: name,
            value: variable.id,
          });
        });
        const cmp = (a, b) => {
          if (a.text > b.text) return 1;
          if (a.text < b.text) return -1;
          return 0;
        };
        vars.sort(cmp);
        const lists = [];
        Object.values(target.variables).forEach((variable) => {
          if (variable.type !== 'list') return;
          let name;
          if (target === curTarget) {
            name = `[LIST]${variable.name}`;
          } else name = `[${target.sprite.name}]: [LIST]${variable.name}`;
          lists.push({
            text: name,
            value: variable.id,
          });
        });
        lists.sort(cmp);
        return [...vars, ...lists]; // 根据字母顺序排列
      };
      if (curTarget && !curTarget.isStage) menu.push(...getOneTargetVar(curTarget));
      this.runtime.targets.forEach((target) => {
        if (!target.isStage && target.isOriginal && target !== curTarget) {
          menu.push(...getOneTargetVar(target));
        }
      });
      if (menu.length === 0) {
        menu.push({
          text: '-',
          value: CONST.EMPTY,
        });
      }
      return menu;
    }

    getFieldText(inputName, fieldName) {
      const selected = Blockly?.selected;
      if (!selected) return null;
      try {
        const block = inputName ? selected.getInput(inputName).connection.targetBlock() : selected;
        const value = block?.getField(fieldName)?.getValue();
        if (value) return value;
      } catch (e) {}
      return null;
    }

    /**
     * Scratch列表的菜单
     * @returns {text: "列表名", value: "列表id"}[];
     */
    listMenu() {
      const menus = [];
      let { variables } = this.runtime._stageTarget;
      Object.keys(variables).forEach((variable) => {
        if (variables[variable].type === 'list') {
          menus.push({
            text: variables[variable].name,
            value: variables[variable].id,
          });
        }
      });
      try {
        variables = this.runtime._editingTarget.variables;
      } catch (e) {
        variables = 'error';
      }
      if (variables !== 'error' && this.runtime._editingTarget !== this.runtime._stageTarget) {
        Object.keys(variables).forEach((variable) => {
          if (variables[variable].type) {
            menus.push({
              text: `[PRIVATE] ${variables[variable].name}`,
              value: variables[variable].id,
            });
          }
        });
      }
      if (menus.length === 0) {
        menus.push({
          text: '-',
          value: CONST.EMPTY,
        });
      }
      return menus;
    }
    // #endregion

    // ************************ ↓一些工具函数 ************************

    /**
     * 根据得到的renderTarget实例，劫持其原型RenderTarget的方法
     * @param {Target} target
     */
    patchRenderTarget(target) {
      this.patcher.patch(target, 'initDrawable', {
        before: function(){
          if (!this.isOriginal) {
            // 触发hat“当克隆体即将启动”
            this.runtime.startHats(`${extensionId}_initTheClone`, null, this);
          }
        }
      });
      const extIns = this;
      this.patcher.patch(target, 'dispose', {
        before: function(){
        // 避免循环删除
          if (this.DollyPro?.isDeleting) return null;
          extIns.onTargetDeleted(this);
        }
      });
    }

    /** 生成targetID
     * @param {Target} target 要生成ID的target
     * @param {string} specID （选填）指定ID
     * @returns {string} 生成的ID，形如sprite_name或clone_#
     */
    generateTargetID(target, specID) {
      let ID;
      // 指定了ID，使用指定ID
      if (specID !== undefined) {
        ID = specID;
      } else if (target.isStage) {
        ID = 'stage';
      } else if (target.isOriginal) {
        this.nextSpriteIDCount += 1;
        ID = `sprite_${this.nextSpriteIDCount}`;
      } else {
        this.nextCloneIDCount += 1;
        ID = `clone_${this.nextCloneIDCount.toString(36)}`;
      }
      // 已经有相同ID，使用原ID
      if (hasOwn.call(this.IDtoTargets, ID)) {
        ID = target.id;
      }
      return ID;
    }

    /**
     * 向 target（克隆体/角色）注入 Dolly 数据（如果还没注入）
     * @param {ITarget} target 要注入的target
     * @param {string} ID 自定义ID（默认为原版的target.id)
     */
    injectDollyTarget(target, ID) {
      // 已注入，退出
      if (target.DollyPro) return;

      // 狠狠注入多莉数据（doge）
      target.DollyPro = {
        ID: this.generateTargetID(target, ID), // 克隆体多莉ID (不指定则默认为原版target.id)
        extraData: Object.create(null), // 克隆体的 KV 数据
        isInGroup: Object.create(null), // 记录是否在某个组，例如 isInGroup["敌人"] == true
      };
      // 加入ID映射表
      this.IDtoTargets[target.DollyPro.ID] = target;
    }

    /**
     * 根据ID，获取target
     * @param {string} ID 克隆体的虚拟ID
     * @returns {ITarget} ID对应的target对象
     */
    getTargetByID(ID) {
      // 先从ID映射表找
      if (hasOwn.call(this.IDtoTargets, ID)) {
        return this.IDtoTargets[ID];
      }
      //  ID表没找到，再使用原版方法找
      const target = this.runtime.getTargetById(ID);
      if (target) {
        this.injectDollyTarget(target);
        return target;
      }
      return undefined;
    }

    /** 读取target的ID */
    getIDOfTarget(target) {
      if (!target.DollyPro) this.injectDollyTarget(target);
      return target.DollyPro.ID;
    }

    /** 读取target的extraData */
    getExtraDataOfTarget(target) {
      if (!target.DollyPro) this.injectDollyTarget(target);
      return target.DollyPro.extraData;
    }

    /**
     * 从输入（如列表JSON、数组、SafeObject）中获取数组。失败时返回null
     * @param {*} input 可能是JSON字符串，数组等
     * @returns {null | Array}
     */
    _getListFromInput(input, ensureSafe = false) {
      let list;
      const { SafeObject } = this.runtime;
      if (SafeObject && input instanceof SafeObject) {
        list = input.value;
      } else if (Array.isArray(input)) {
        list = input;
      } else {
        list = Cast.toString(input);
        try {
          list = JSON.parse(list);
        } catch (error) {
          return null;
        }
      }
      if (Array.isArray(list)) {
        if (ensureSafe) {
          list = list.map((item) => {
            const t = typeof item;
            if (t !== 'string' && t !== 'number' && t !== 'boolean') {
              return JSON.stringify(item);
            }
            return item;
          });
        }
        return list;
      }
      return null;
    }

    _lookUpPrivateVarByIdOrName(target, key) {
      let va = target.lookupVariableById(key);
      if (!va) {
        va = Object.values(target.variables).find((variable) => variable.name === key);
      }
      return va;
    }

    /** 克隆体克隆后，进行一些处理（包括读取预设数据、触发hat） */
    onCloneCreated(target, curThread) {
      // 从当前活跃线程上获取预设数据
      const thread = curThread ?? this.runtime.sequencer.activeThread;
      let threadInfo;
      if (thread) {
        threadInfo = this._getOrInitInfoInThread(thread);
      } else {
        threadInfo = {
          groups: Object.create(null),
          data: Object.create(null),
          props: Object.create(null),
          vars: Object.create(null),
        };
      }
      const { data, groups, props, vars } = threadInfo;
      const ID = this.getIDOfTarget(target);
      threadInfo.justCreatedCloneID = ID;
      // 读取预设KV数据
      target.DollyPro.extraData = data;
      // 原型设为 null
      Object.setPrototypeOf(target.DollyPro.extraData, null);
      // 加入预设分组
      Object.keys(groups).forEach((group) => {
        if (groups[group]) {
          target.DollyPro.isInGroup[group] = true;
          const list = this.getOrCreateGroupByName(group);
          list.push(ID);
        }
      });

      // 读取预设属性（x、y、direction等）
      Object.keys(props).forEach((prop) => {
        this.opPropertyOfTarget(target, prop, 'set', props[prop]);
      });

      // 设置私有变量
      Object.keys(vars).forEach((vid) => {
        const variable = this._lookUpPrivateVarByIdOrName(target, vid);
        if (!variable) return;
        if (variable.type === 'list') {
          // 私有列表
          const list = this._getListFromInput(vars[vid], true);
          if (list) variable.value = list;
        } else {
          // 私有变量
          variable.value = vars[vid];
        }
      });

      // 读取结束后，清空预设数据
      this._getOrInitInfoInThread(thread, true);

      // 广播克隆体产生的hat
      callStartHatsWithParams(
        this.runtime,
        `${extensionId}_dispatchWhenCloned`,
        {
          parameters: { ID },
          fields: { TARGET: target.sprite.name },
        }
      );
      callStartHatsWithParams(
        this.runtime,
        `${extensionId}_dispatchWhenCloned`,
        {
          parameters: { ID },
          fields: { TARGET: CONST.ALL },
        }
      );

      // 记录刚克隆的克隆体ID
      this.justCreatedCloneID = this.getIDOfTarget(target);
    }

    /**
     * 在移除 target(角色/克隆体)前，处理后事
     * @param {ITarget} target 即将被移除的target
     */
    onTargetDeleted(target) {
      let ID;
      if (!target.DollyPro) {
        // 如果target没接入多莉系统
        ID = target.id;
      } else {
        // 如果 target 接入多莉系统
        ID = target.DollyPro.ID;
        // 如果target是克隆体
        if (!target.isOriginal) {
          // 广播“有角色的克隆体被删除”的hat积木
          callStartHatsWithParams(
            this.runtime,
            `${extensionId}_dispatchWhenCloneDeleted`,
            {
              parameters: { ID },
              fields: { TARGET: target.sprite.name },
            },
            target
          );
          callStartHatsWithParams(
            this.runtime,
            `${extensionId}_dispatchWhenCloneDeleted`,
            {
              parameters: { ID },
              fields: { TARGET: CONST.ALL },
            },
            target
          );
          // 标记克隆体为正在删除
          target.DollyPro.isDeleting = true;
          // 触发“本克隆体即将删除”的hat积木
          const threads = this.runtime.startHats(`${extensionId}_beforeDeletionOfTheClone`, null, target);
          // 立即执行该 hat（克隆体执行完该hat后，就被立即删除）
          if (threads) {
            threads.forEach((thread) => {
              if (!thread.isCompiled) {
                // 非编译模式，立即执行(编译模式在startHats中已执行)
                this.runtime.sequencer.stepThread(thread);
                thread.status = 4; // 执行一次后立即丢弃
              }
            });
          }
        }

        // 从克隆体分组中移除 target
        Object.keys(target.DollyPro.isInGroup).forEach((group) => {
          const list = this.getGroupByName(group);
          if (!list) return;
          const idx = list.indexOf(ID);
          if (idx === -1) return;
          list.splice(idx, 1);
        });
      }
      // 从ID映射表移除target
      delete this.IDtoTargets[ID];
    }

    /**
     * 读取target的x,y,direction
     * @param {ITarget} target 要读取对象
     * @param  {...string} props 要读取的内容，例如'x','y','direction'
     * @returns {[number]} 读取结果，如[123,123]
     */
    getTargetXYDir(target, ...props) {
      const res = [];
      props.forEach((prop) => {
        const key = this.accessTransfer[prop];
        if (key && !target.isPoint) res.push(this.getDataOfTarget(target, key));
        else {
          res.push(target[prop]);
        }
      });
      if (res.length < 2) return res[0];
      return res;
    }

    /** 周期裁剪（例如11裁剪到1~10,返回1） */
    wrapClamp(n, min, max) {
      const range = max - min + 1;
      return n - Math.floor((n - min) / range) * range;
    }

    /** 普通裁剪 */
    clamp(n, min, max) {
      return Math.min(Math.max(n, min), max);
    }

    /**
     * 设置target的x,y,direction
     * @param {ITarget} target 要设置的对象
     * @param  {object} props 要设置内容，如{x:['set',123], y:['change',123], direction:['set',123]}
     */
    setTargetXYDir(target, props) {
      let newX;
      let newY;
      Object.keys(props).forEach((prop) => {
        const op = props[prop][0];
        const value = props[prop][1];
        const key = this.accessTransfer[prop];
        if (key) {
          this.setOrChangeDataOfTarget(target, key, op, value);
          if (prop === 'direction') {
            const dir = this.wrapClamp(this.getDataOfTarget(target, key), -179, 180);
            this.setOrChangeDataOfTarget(target, key, 'set', dir);
          }
        } else {
          switch (prop) {
            case 'x':
              if (op === 'set') newX = value;
               
              else newX = target.x + value;
              break;
            case 'y':
              if (op === 'set') newY = value;
               
              else newY = target.y + value;
              break;
            case 'direction':
              if (op === 'set') target.setDirection(value);
              else target.setDirection(target.direction + value);
              break;
          }
        }
      });
      if (newX !== undefined || newY !== undefined) {
        target.setXY(newX ?? target.x, newY ?? target.y);
      }
    }

    /**
     * 获取克隆体分组（不自动创建）
     * @param {String} groupName 分组名
     * @return {[[ID: string]]} 克隆体分组ID表
     */
    getGroupByName(groupName) {
      return this.groupsOfClones[groupName];
    }

    /**
     * 获取克隆体分组（如果没有则创建分组）
     * @param {String} groupName 分组名
     * @return {[[ID: string]]} 克隆体分组ID表
     */
    getOrCreateGroupByName(groupName) {
      if (!hasOwn.call(this.groupsOfClones, groupName)) {
        this.groupsOfClones[groupName] = [];
      }
      return this.groupsOfClones[groupName];
    }

    /**
     * 将 target 加入分组
     * @param {ITarget} target 要加入的target
     * @param {string} group 分组名
     */
    addTargetToGroup(target, group) {
      if (!target.DollyPro) this.injectDollyTarget(target);
      // 已加入分组，直接返回
      if (target.DollyPro.isInGroup[group]) return;
      // 标记为加入分组
      target.DollyPro.isInGroup[group] = true;
      // 获取克隆体分组列表，不存在则创建
      const list = this.getOrCreateGroupByName(group);
      const ID = this.getIDOfTarget(target);
      if (list.includes(ID)) return;
      list.push(ID);
    }

    /**
     * 将 target 移出分组
     * @param {ITarget} target 要移出的target
     * @param {string} group 分组名
     */
    removeTargetFromGroup(target, group) {
      if (!target.DollyPro) this.injectDollyTarget(target);
      // 不在分组中，直接返回
      if (!target.DollyPro.isInGroup[group]) return;
      // 标记为移出分组
      delete target.DollyPro.isInGroup[group];
      // 获取克隆体分组列表
      const list = this.getGroupByName(group);
      // 分组不存在则直接返回
      if (!list) return;
      const ID = this.getIDOfTarget(target);
      const idx = list.indexOf(ID);
      // target不在分组中，直接返回
      if (idx === -1) return;
      // 将target移出分组
      list.splice(idx, 1);
    }

    // ************************ ↑一些工具函数 ************************

    /** 获取刚产生的克隆体的ID */
    getJustCreatedCloneID(args, util) {
      const threadInfo = this._getOrInitInfoInThread(util.thread);
      // 优先读取线程上的克隆信息，没有时才读取全局的
      return threadInfo.justCreatedCloneID ?? this.justCreatedCloneID;
    }

    dispatchWhenCloned() {
      return true;
    }

    dispatchWhenCloneDeleted() {
      return true;
    }

    initTheClone() {
      return true;
    }

    beforeDeletionOfTheClone() {
      return true;
    }

    /**
     * 朝ID/标签/角色克隆体广播
     * @param {'ID'|'group'|'sprite'} MENU ID/group/sprite
     * @param {string} VALUE ID内容/组名/角色名
     * @param {string} MSG 信息名
     * @param {*} data 附带信息
     */
    broadcastToClone({ VALUE, MENU, MSG, data }, util) {
      const targets = this.getClonesOfGroupOrSprite(MENU, Cast.toString(VALUE), false, util);
      if (!targets || targets.length === 0) return;
      const senderID = this.getIDOfTarget(util.target);
      targets.forEach((target) => {
        callStartHatsWithParams(
          util,
          `${extensionId}_receiveMyBroadcast`,
          {
            parameters: { data, senderID },
            // 根据hat中的 TEXT 输入，过滤hat积木
            fields: { TEXT: Cast.toString(MSG) },
          },
          target
        ); 
      });
    }

    receiveMyBroadcast() {
      return true;
    }

    test(args) {
      console.log('IDmap:', this.IDtoTargets);
      console.log('targets:', this.runtime.targets);
      return Cast.toString(this.getTargetByID(args.ID));
    }

    onShowMoreClick() {
      this.hideExtraBlocks = !this.hideExtraBlocks;
      this.storeExtConfig();
      this.runtime.emit('TOOLBOX_EXTENSIONS_NEED_UPDATE');
    }

    /**
     * 修改角色ID
     * @param {ID} 修改后的ID
     */
    setMyID({ ID }, util) {
      const newID = Cast.toString(ID);
      this._updateTargetID(util.target, newID, true);
    }

    _updateTargetID(target, newID, isFromUser = false) {
      const oldID = this.getIDOfTarget(target);
      // 旧ID和新ID一样，直接返回
      if (oldID === newID) {
        this.logWarn(this.formatMessage('warn.newIDIsOldID').replace('%s', oldID));
        return;
      }
      // ID重复
      if (this.getTargetByID(newID)) {
        this.logError(this.formatMessage('warn.repetitveID').replace('%s', newID));
        return;
      }
      // 如果是非用户修改ID（例如角色重命名时，扩展自动更新角色ID为 `sprite:新名字`）
      // 若用户之前手动更改了ID，则禁止非用户的变更ID，防止意外行为
      if (!isFromUser && target.DollyPro.__IDUpdatedByUser) {
        return;
      }
      if (isFromUser) target.DollyPro.__IDUpdatedByUser = true;
      target.DollyPro.ID = newID;
      this.IDtoTargets[newID] = this.IDtoTargets[oldID];
      delete this.IDtoTargets[oldID];
      // 更新分组信息里的ID
      Object.values(this.groupsOfClones).forEach((group) => {
        const idx = group.indexOf(oldID);
        if (idx !== -1) {
          group[idx] = newID;
        }
      });
    }

    transferAccessToTargetXYToDollyDataKey({ X_NAME, Y_NAME, DIR_NAME }) {
      const X = Cast.toString(X_NAME);
      const Y = Cast.toString(Y_NAME);
      const DIR = Cast.toString(DIR_NAME);
      this.accessTransfer.x = X === '' ? null : X;
      this.accessTransfer.y = Y === '' ? null : Y;
      this.accessTransfer.direction = DIR === '' ? null : DIR;
    }

    cancelAccessTransfer() {
      this.accessTransfer = {};
    }

    // ************************ 普通积木 ************************

    /** 某个ID的克隆体是否存在 */
    ifCloneExists({ ID }) {
      return !!this.getTargetByID(Cast.toString(ID));
    }

    /**
     * 计算两克隆体间的距离/方向/角度差/角度差绝对值
     * @param {ITarget} target1 克隆体ID1
     * @param {ITarget} target2 克隆体ID2
     * @param {'dis'|'dir'|'angle'|'absAngle'} MENU 计算菜单：dis/dir/angle/absAngle
     * @returns {number} 计算结果
     */
    calcInfoBetweenTargets(target1, target2, MENU) {
      if (MENU === 'dis') {
        return this.calcDistanceBetweenTargets(target1, target2);
      }

      const dir = this.calcDirectionBetweenTargets(target1, target2);
      if (MENU === 'dir') {
        return dir;
      }
      const diff = this.calcDifferenceFromDir1ToDir2(target1.direction, dir);
      if (MENU === 'angle') return diff;
      return Math.abs(diff);
    }

    calcDirectionBetweenTargets(target1, target2) {
      const [X1, Y1] = this.getTargetXYDir(target1, 'x', 'y');
      const [X2, Y2] = this.getTargetXYDir(target2, 'x', 'y');
      let dir = (Math.atan((X2 - X1) / (Y2 - Y1)) / Math.PI) * 180 + (Y1 > Y2 ? 180 : 0);
      if (dir > 180) dir -= 360;
      return dir;
    }

    calcDistanceBetweenTargets(target1, target2) {
      const [X1, Y1] = this.getTargetXYDir(target1, 'x', 'y');
      const [X2, Y2] = this.getTargetXYDir(target2, 'x', 'y');
      return Math.sqrt((X2 - X1) ** 2 + (Y2 - Y1) ** 2);
    }

    calcDifferenceFromDir1ToDir2(dir1, dir2) {
      let dif = dir2 - dir1;
      dif -= Math.round(dif / 360) * 360;
      if (dif === -180) dif = 180;
      return dif;
    }

    /** 计算当前角色到ID克隆体的距离/方向/角度差信息 */
    calcDistanceToClone({ ID, MENU }, util) {
      const target = this.getTargetByID(Cast.toString(ID));
      if (!target) return 0;
      return this.calcInfoBetweenTargets(util.target, target, MENU);
    }

    /** 计算ID1到ID2的距离/方向/角度差信息 */
    calcDistanceBetweenClones({ ID1, ID2, MENU }) {
      const target1 = this.getTargetByID(Cast.toString(ID1));
      if (!target1) return 0;
      const target2 = this.getTargetByID(Cast.toString(ID2));
      if (!target2) return 0;
      return this.calcInfoBetweenTargets(target1, target2, MENU);
    }

    infoBetweenCloneAndPoint({ ID, X, Y, MENU }) {
      const target = this.getTargetByID(Cast.toString(ID));
      if (!target) return 0;
      const [X1, Y1] = this.getTargetXYDir(target, 'x', 'y');
      const [X2, Y2] = [Cast.toNumber(X), Cast.toNumber(Y)];
      if (MENU === 'dis') {
        return Math.sqrt((X2 - X1) ** 2 + (Y2 - Y1) ** 2);
      }

      let dir = (Math.atan((X2 - X1) / (Y2 - Y1)) / Math.PI) * 180 + (Y1 > Y2 ? 180 : 0);
      if (dir > 180) dir -= 360;
      if (MENU === 'dir') {
        return dir;
      }
      // 角度差
      let dif = dir - target.direction;
      dif -= Math.round(dif / 360) * 360;
      if (dif === -180) dif = 180;
      if (MENU === 'angle') return dif;
      return Math.abs(dif);
    }

    /** 计算ID1到ID2的距离/方向/角度差信息 */
    moveToClone({ MOTION, ID }, util) {
      const target = this.getTargetByID(Cast.toString(ID));
      if (!target) return;
      const [tx, ty] = this.getTargetXYDir(target, 'x', 'y');
      if (MOTION === 'moveTo') {
        this.setTargetXYDir(util.target, { x: ['set', tx], y: ['set', ty] });
      } else {
        const dir = this.calcDirectionBetweenTargets(util.target, target);
        if (dir.isNaN) return;
        this.setTargetXYDir(util.target, { direction: ['set', dir] });
      }
    }

    /**
     * 朝target移动步数/旋转角度
     * @param {*} target
     * @param {'move'|'rotate'} MOTION
     * @param {number} velocity
     * @returns
     */
    moveStepsToTarget(target, MOTION, velocity, util) {
      if (!target) return;
      const [tx, ty] = this.getTargetXYDir(target, 'x', 'y');
      if (MOTION === 'move') {
        const dis = this.calcDistanceBetweenTargets(util.target, target);
        if (dis <= velocity) {
          // 距离比移动距离小，直接移到目标
          this.setTargetXYDir(util.target, { x: ['set', tx], y: ['set', ty] });
        } else {
          // 否则，朝目标位置移动
          const [myX, myY] = this.getTargetXYDir(util.target, 'x', 'y');
          const dx = ((tx - myX) * velocity) / dis;
          const dy = ((ty - myY) * velocity) / dis;
          this.setTargetXYDir(util.target, {
            x: ['change', dx],
            y: ['change', dy],
          });
        }
      } else {
        const dir = this.calcDirectionBetweenTargets(util.target, target);
        if (dir.isNaN) return;
        const myDir = this.getTargetXYDir(util.target, 'direction');
        const diff = this.calcDifferenceFromDir1ToDir2(myDir, dir);
        if (Math.abs(diff) <= velocity) {
          // 角度差比转速小，直接面向目标
          this.setTargetXYDir(util.target, { direction: ['set', dir] });
        } else {
          // 否则，朝目标旋转
          this.setTargetXYDir(util.target, {
            direction: ['change', diff > 0 ? velocity : -velocity],
          });
        }
      }
    }

    /** 朝克隆体移动步数/旋转角度 */
    moveStepsToClone({ ID, MOTION, VALUE }, util) {
      const target = this.getTargetByID(Cast.toString(ID));
      const velocity = Cast.toNumber(VALUE);
      if (!target) return;
      this.moveStepsToTarget(target, MOTION, velocity, util);
    }

    /**
     * 获取thread上的克隆体预设数据，不存在则自动创建
     * @param {*} thread
     * @param {boolean} [init=false] 是否清空
     * @returns {{groups:{}, data:{}, props:{}}}
     */
    _getOrInitInfoInThread(thread, init = false) {
      if (thread.dollyProPreset && !init) return thread.dollyProPreset;
      thread.dollyProPreset = {
        justCreatedCloneID: thread.dollyProPreset?.justCreatedCloneID,
        groups: Object.create(null),
        data: Object.create(null),
        props: Object.create(null),
        vars: Object.create(null),
      };
      return thread.dollyProPreset;
    }

    presetGroupForTheNextClone({ GROUP }, util) {
      const preset = this._getOrInitInfoInThread(util.thread);
      preset.groups[String(GROUP)] = true;
    }

    cloneIDOfForEach(args, util) {
      return this.forEachIndex[util.thread.topBlock] ?? '';
    }

    forEachWithGroup(args, util) {
      const groupList = this.getGroupByName(Cast.toString(args.GROUP));
      if (!groupList) return;

      const times = groupList.length;
      if (times === 0) return;

      if (typeof util.stackFrame.loopCounter === 'undefined') {
         
        util.stackFrame.loopCounter = times;
      }

       
      util.stackFrame.loopCounter -= 1;
      const idx = times - util.stackFrame.loopCounter - 1;
      if (idx > times - 1) return;
      this.forEachIndex[util.thread.topBlock] = groupList[idx];

      if (util.stackFrame.loopCounter >= 0) {
        util.startBranch(1, true);
      }
    }

    /**
     * 获取ID/标签/角色的target
     * @param {'ID'|'group'|'sprite'} MENU
     * @param {string} VALUE ID/组名/角色名
     * @param {boolean} [excludeOriginal=false] 当读取角色名时，是否是获取本体
     * @returns {[ITarget]|undefined} target表
     */
    getClonesOfGroupOrSprite(MENU, VALUE, excludeOriginal = false, util) {
      switch (MENU) {
        case 'ID': {
          const target = this.getTargetByID(VALUE);
          if (!target) return undefined;
          return [target];
        }
        case 'group': {
          const IDs = this.getGroupByName(VALUE);
          if (!IDs) return undefined;
          return IDs.map((ID) => this.getTargetByID(ID));
        }
        case 'IDlist': {
          const IDs = this._getListFromInput(VALUE);
          if (!IDs) return undefined;
          return IDs.map((ID) => this.getTargetByID(ID));
        }
        case 'sprite': // 历史选项：不同积木对 'sprite' 的处理不同，有的含本体有的不含
        case 'spriteClone':
        case 'spriteOnly':
        case 'cloneOnly': {
          let target;
          if (VALUE === CONST.MYSELF) target = util.target;
          else target = this.runtime.getSpriteTargetByName(VALUE);
          if (!target) return undefined;
          const targets = target.sprite.clones;
          if (MENU === 'spriteOnly') return [targets[0]];
          if (MENU === 'cloneOnly' || (excludeOriginal && MENU === 'sprite')) return targets.slice(1);
          return targets;
        }
        default:
          return undefined;
      }
    }

    _getNearestTarget(tar, targets, TYPE) {
      let closestID = '';
      const isNear = TYPE === 'nearest';
      let minDistance = Infinity;

      targets.forEach((target) => {
        if (target !== tar) {
          let distance = this.calcDistanceBetweenTargets(tar, target);
          // 求最远距离，则反转
          if (!isNear) distance *= -1;

          if (distance < minDistance) {
            minDistance = distance;
            closestID = this.getIDOfTarget(target);
          }
        }
      });
      return closestID;
    }

    getNearestClone({ MENU, VALUE, TYPE }, util) {
      const targets = this.getClonesOfGroupOrSprite(MENU, Cast.toString(VALUE), true, util);
      if (!targets) return '';
      return this._getNearestTarget(util.target, targets, TYPE);
    }

    getNearestForID({ ID, MENU, VALUE, TYPE }, util) {
      const target = this.getTargetByID(Cast.toString(ID));
      if (!target) return '';
      const targets = this.getClonesOfGroupOrSprite(MENU, Cast.toString(VALUE), true, util);
      if (!targets) return '';
      return this._getNearestTarget(target, targets, TYPE);
    }

    /** Scratch坐标转换为Client坐标 */
    ScratchXYToClientXY(x, y) {
      let canvasHeight = 0;
      let canvasWidth = 0;
      if (this.canvas) {
        const rect = this.canvas.getBoundingClientRect();
        canvasHeight = rect.height;
        canvasWidth = rect.width;
      }
      const x2 = (x / this.runtime.stageWidth + 0.5) * canvasWidth;
      const y2 = (-y / this.runtime.stageHeight + 0.5) * canvasHeight;
      return [x2, y2];
    }

    isCloneTouchingCoord({ X, Y, MENU, VALUE }, util) {
      const targets = this.getClonesOfGroupOrSprite(MENU, Cast.toString(VALUE), false, util);
      if (!targets) return false;
      const { renderer } = this.runtime;
      const [x, y] = this.ScratchXYToClientXY(Cast.toNumber(X), Cast.toNumber(Y));
      return targets.some((target) => target.visible && renderer.drawableTouching(target.drawableID, x, y));
    }

    /** 获取XY处最顶层角色或克隆体ID */
    pickTarget({ X, Y }) {
      const { renderer } = this.runtime;
      const [x, y] = this.ScratchXYToClientXY(Cast.toNumber(X), Cast.toNumber(Y));
      if (renderer) {
        const drawableID = renderer.pick(x, y);
        if (!drawableID) return '';
        for (let i = 0; i < this.runtime.targets.length; i += 1) {
          const target = this.runtime.targets[i];
          if (target.drawableID === drawableID) {
            return this.getIDOfTarget(target);
          }
        }
      }
      return '';
    }

    /**
     * target是否碰到ID/标签/角色
     * @param {*} target
     * @param {'ID'|'group|'sprite'} MENU
     * @param {string} VALUE
     * @returns
     */
    targetTouchingClone(target, MENU, VALUE, util) {
      const targets = this.getClonesOfGroupOrSprite(MENU, Cast.toString(VALUE), true, util);
      if (!targets) return false;

      const { renderer } = this.runtime;
      // // 检测角色时，只检测克隆体
      // if (MENU === 'sprite') {
      //   targets = targets.filter((target) => {
      //     return !target.isOriginal;
      //   });
      // }
      const drawableCandidates = targets.map((clone) => clone.drawableID);
      return renderer.isTouchingDrawables(target.drawableID, drawableCandidates);
    }

    isCloneTouchingClone({ ID, MENU, VALUE }) {
      const target = this.getTargetByID(Cast.toString(ID));
      if (!target) return false;
      return this.targetTouchingClone(target, MENU, VALUE);
    }

    isTouchingClone({ MENU, VALUE }, util) {
      return this.targetTouchingClone(util.target, MENU, VALUE);
    }

     
    actualGetTouchingID(targets, TYPE, util) {
      const { renderer } = this.runtime;

      const IDs = [];
      for (let i = 0; i < targets.length; i += 1) {
        const target = targets[i];
        if (target !== util.target) {
          // 碰到对方
          if (renderer.isTouchingDrawables(util.target.drawableID, [target.drawableID])) {
            const ID = this.getIDOfTarget(target);
            if (TYPE === 'one') {
              return ID;
            }
            IDs.push(ID);
          }
        }
      }
      if (TYPE === 'one') {
        return '';
      }
      return IDs;
    }

    getTouchingID({ MENU, VALUE, TYPE }, util) {
      const targets = this.getClonesOfGroupOrSprite(MENU, Cast.toString(VALUE), true, util);
      if (!targets) return TYPE === 'one' ? '' : '[]';
      const res = this.actualGetTouchingID(targets, TYPE, util);
      if (TYPE === 'one') {
        return res;
      }
      return JSON.stringify(res);
    }

    importTouchingIDsIntoList({ MENU, VALUE, OP, LIST }, util) {
      let list = LIST;
      if (typeof list === 'object') list = list.name;
      let targets = this.getClonesOfGroupOrSprite(MENU, Cast.toString(VALUE), true, util);
      if (!targets) targets = [];
      const res = this.actualGetTouchingID(targets, 'all', util);
      this.importArrayIntoScratchList(res, OP, list, util);
    }
    // --------

    addOrRemoveMyselfFromGroup({ OP, GROUP }, util) {
      if (OP === 'add') {
        this.addTargetToGroup(util.target, Cast.toString(GROUP));
      } else {
        this.removeTargetFromGroup(util.target, Cast.toString(GROUP));
      }
    }

    removeAllTags({ ID }) {
      const target = this.getTargetByID(Cast.toString(ID));
      if (!target) return;
      Object.keys(target.DollyPro.isInGroup).forEach((group) => {
        this.removeTargetFromGroup(target, group);
      });
    }

    addOrRemoveIDFromGroup({ ID, OP, GROUP }) {
      const target = this.getTargetByID(Cast.toString(ID));
      if (!target) return;
      if (OP === 'add') {
        this.addTargetToGroup(target, Cast.toString(GROUP));
      } else {
        this.removeTargetFromGroup(target, Cast.toString(GROUP));
      }
    }

    ifCloneInGroup({ ID, GROUP }) {
      const target = this.getTargetByID(Cast.toString(ID));
      if (!target) return false;
      return !!target.DollyPro.isInGroup[String(GROUP)];
    }

    getGroupsOfClone({ ID }) {
      const target = this.getTargetByID(Cast.toString(ID));
      if (!target) return '[]';
      return JSON.stringify(Object.keys(target.DollyPro.isInGroup));
    }

    getGroupInfo({ GROUP, PROPERTY }) {
      const groupList = this.getGroupByName(Cast.toString(GROUP));
      switch (PROPERTY) {
        case 'count':
          if (!groupList) return 0;
          return groupList.length;
        case 'json':
          if (!groupList) return '';
          return JSON.stringify(groupList.map((ID) => this.getTargetByID(ID)));
        case 'IDList':
          if (!groupList) return '[]';
          return JSON.stringify(groupList);
        default:
          return '';
      }
    }

    getClonePropertyInGroup({ GROUP, INDEX, PROPERTY }) {
      const groupList = this.getGroupByName(Cast.toString(GROUP));
      if (!groupList) return '';
      const idx = Cast.toNumber(INDEX);
      if (idx < 1 || idx > groupList.length) return '';
      const target = this.getTargetByID(groupList[idx - 1]);
      if (!target) return '';
      return this.propertyOfTarget(target, PROPERTY);
    }

    importArrayIntoScratchList(array, OP, LIST, util) {
      if (LIST === CONST.EMPTY) return;
      let list = util.target.lookupVariableById(LIST);
      if (!list) {
        list = util.target.lookupVariableByNameAndType(LIST, 'list');
        if (!list) return;
      }
      if (OP === 'replace') {
        if (array) {
          list.value = [...array];
        } else {
          list.value = [];
        }
      } else {
        if (!array) return;
        list.value = list.value.concat(array);
      }
    }

    importGroupIntoList({ GROUP, OP, LIST }, util) {
      let list = LIST;
      if (typeof list === 'object') list = list.name;
      if (list === CONST.EMPTY) return;
      const groupList = this.getGroupByName(Cast.toString(GROUP));
      this.importArrayIntoScratchList(groupList, OP, list, util);
    }

    /**
     * 判断角色是否是克隆体/本体
     * @param {string} args.KEY 判断类型：clone克隆体/original本体
     * @returns {boolean}
     */
    isCloneOrIsOriginal(args, util) {
      return args.TYPE === 'clone' ? !util.target.isOriginal : util.target.isOriginal;
    }

    /**
     * 预设克隆体Property(如x、y坐标)
     * @param {string} args.PROPERTY 预设属性：_x/_y/_size...
     * @param {string|number|boolean} args.VALUE 值
     */
    presetPropertyForTheNextClone(args, util) {
      const preset = this._getOrInitInfoInThread(util.thread);
      preset.props[args.PROPERTY] = args.VALUE;
    }

    /**
     * 预设克隆体单条数据KEY
     * @param {string} args.KEY 预设KEY
     * @param {string|number|boolean} args.VALUE 值
     */
    presetSingleDataForTheNextClone(args, util) {
      const preset = this._getOrInitInfoInThread(util.thread);
      // this.recordDataKeyForTarget(util.target, args.KEY);
      preset.data[args.KEY] = args.VALUE;
    }

    presetVarForTheNextClone(args, util) {
      const preset = this._getOrInitInfoInThread(util.thread);
      preset.vars[args.VAR] = args.VALUE;
    }

    /**
     * 预设克隆体数据JSON
     * @param {string} args.DATA_JSON 预设JSON
     */
    presetDataforTheNextCloneInJSONFormat(args, util) {
      const preset = this._getOrInitInfoInThread(util.thread);
      try {
        const obj = JSON.parse(Cast.toString(args.DATA_JSON));
        if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
          preset.data = obj;
        } else {
          this.logWarn('Dolly pro: Preseting clone JSON data fails.');
        }
      } catch (e) {
        this.logWarn('Dolly pro: Preseting clone JSON data fails.', e);
      }
    }

    /**
     * 修改target的x/y/size等属性
     * @param {ITarget} target 目标
     * @param {string} prop 属性名
     * @param {'set'|'change'} op 操作set/change
     * @param {*} v 值
     * @private
     */
    opPropertyOfTarget(target, prop, op, v) {
      const numberV = Cast.toNumber(v);
      const isChanging = op === 'change';
      switch (prop) {
        case 'x':
          target.setXY(isChanging * target.x + numberV, target.y);
          return;
        case 'y':
          target.setXY(target.x, isChanging * target.y + numberV);
          return;
        case 'size':
          target.setSize(isChanging * target.size + numberV);
          return;
        case 'direction':
          target.setDirection(isChanging * target.direction + numberV);
          return;
        case 'visible':
          target.setVisible(!!(isChanging * target.visible + Cast.toBoolean(numberV)));
          return;
        case 'currentCostumeName':
          if (typeof v === 'number') {
            if (isChanging) target.setCostume(target.currentCostume + v);
            else target.setCostume(v - 1);
          } else {
            if (isChanging) return;
            const costumeIndex = target.getCostumeIndexByName(v.toString());
            if (costumeIndex !== -1) {
              target.setCostume(costumeIndex);
            }
          }
          return;
        case 'color':
        case 'fisheye':
        case 'whirl':
        case 'pixelate':
        case 'brightness':
        case 'ghost':
        case 'mosaic': {
          let value = numberV + isChanging * target.effects[prop];
          value = this.clampEffect(prop, value);
          target.setEffect(prop, value);
          break;
        }
        case 'dataJSON': {
          // 设置克隆体KV数据对象
          if (!target.DollyPro) this.injectDollyTarget(target);
          let obj = v;
          // 尝试以JSON解析
          if (typeof v === 'string') {
            try {
              obj = JSON.parse(v);
            } catch (e) {
              return;
            }
          }
          if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return;
          const { SafeObject } = this.runtime;
          if (SafeObject) {
            obj = SafeObject.getActualObject(v);
          }
          Object.setPrototypeOf(obj, null);
          target.DollyPro.extraData = obj;
          break;
        }
      }
    }

    /** clamp特效值，限制在正确范围内 */
    clampEffect(effect, value) {
      switch (effect) {
        case 'ghost':
          return this.clamp(value, 0, 100);
        case 'brightness':
          return this.clamp(value, -100, 100);
        default:
          return value;
      }
    }

    createCloneAndSpecifyData({ TARGET, KEY, VALUE }, util) {
      this.presetSingleDataForTheNextClone({ KEY, VALUE }, util);
      this.createCloneAndSpecifyID({ TARGET, ID: '' }, util);
    }

    /**
     * 克隆角色，并设置克隆体ID
     * @param {ITarget} args.TARGET 要克隆的角色名
     * @param {string} args.ID 指定的ID
     */
    createCloneAndSpecifyID(args, util) {
      const TARGET = Cast.toString(args.TARGET);
      let specifyingID = Cast.toString(args.ID);

      // 获取要克隆的target
      let cloneTarget;
      if (TARGET === CONST.MYSELF) {
        cloneTarget = util.target;
      } else {
        cloneTarget = this.runtime.getSpriteTargetByName(TARGET);
      }
      // If clone target is not found, return
      if (!cloneTarget || cloneTarget.isStage) return;
      // Create clone
      const newClone = cloneTarget.makeClone();

      if (newClone) {
        // 未指定 ID
        if (specifyingID === '') {
          specifyingID = undefined;
        } else if (hasOwn.call(this.IDtoTargets, specifyingID)) {
          // 如果已经存在相同 ID
          this.logWarn(this.formatMessage('error.repetitiveID').replace('%s', specifyingID));
          specifyingID = undefined;
        }
        // 注入dolly并设置ID
        this.injectDollyTarget(newClone, specifyingID);

        this.runtime.addTarget(newClone);
        // Place behind the original target.
        newClone.goBehindOther(cloneTarget);
      }
    }

    /**
     * 删除指定ID的克隆体
     * @param {string} args.ID 要删除的克隆体ID
     */
    deleteCloneByID(args) {
      const ID = Cast.toString(args.ID);
      const target = this.getTargetByID(ID);
      if (target) {
        if (target.isOriginal) return;
        this.runtime.disposeTarget(target);
        this.runtime.stopForTarget(target);
      }
    }

    /**
     * 获取某个ID克隆体的KEY数据
     * @param {string} args.ID 克隆体的虚拟ID
     * @param {string} args.KEY 数据KEY
     * @returns {string|number|boolean} 克隆体的KEY对应数据
     */
    getValueOfCloneIDWithKey(args) {
      const target = this.getTargetByID(Cast.toString(args.ID));
      if (!target) return '';
      return this.getDataOfTarget(target, Cast.toString(args.KEY));
    }

    getPrivateVarOfClone(args) {
      const target = this.getTargetByID(Cast.toString(args.ID));
      if (!target) return '';
      const va = this._lookUpPrivateVarByIdOrName(target, Cast.toString(args.VAR));
      if (!va) return '';
      if (va.type === 'list') return this.returnList(va.value);
      return va.value;
    }

    /**
     * 输入array，得到作为积木返回值的结果（通常是列表JSON）
     * @param {Array} array
     */
    returnList(array) {
      return JSON.stringify(array);
    }

    getMyValueByKey(args, util) {
      return this.getDataOfTarget(util.target, Cast.toString(args.KEY));
    }

    getDataOfTarget(target, key) {
      const data = this.getExtraDataOfTarget(target);
      return data[key] ?? '';
    }

    /**
     * 修改某个ID克隆体的KEY数据
     * @param {string} args.ID 克隆体的虚拟ID
     * @param {string} args.PROPERTY 数据
     * @param {string} args.OP 操作(set设置/change增加)
     * @param {*} args.VALUE 值
     */
    setCloneProperty(args) {
      const target = this.getTargetByID(Cast.toString(args.ID));
      if (!target) return;
      this.opPropertyOfTarget(target, args.PROPERTY, args.OP, args.VALUE);
    }

    /**
     * 修改某个ID克隆体的KEY数据
     * @param {string} args.ID 克隆体的虚拟ID
     * @param {string} args.KEY 数据KEY
     * @param {string} args.OP 操作(set设置/change增加)
     * @param {*} args.VALUE 值
     */
    setOrChangeValueOfCloneIDWithKey(args) {
      const target = this.getTargetByID(Cast.toString(args.ID));
      if (!target) return;
      this.setOrChangeDataOfTarget(target, Cast.toString(args.KEY), args.OP, args.VALUE);
    }

    setPrivateVarOfClone(args) {
      const target = this.getTargetByID(Cast.toString(args.ID));
      if (!target) return;
      const va = this._lookUpPrivateVarByIdOrName(target, Cast.toString(args.VAR));
      if (!va) return;
      if (args.OP === 'set') {
        if (va.type === 'list') {
          // 私有列表
          const list = this._getListFromInput(args.VALUE, true);
          if (list) va.value = list;
        } else {
          // 私有变量
          va.value = args.VALUE;
        }
      } else {
        // 列表不能“增加”
        if (va.type === 'list') return;
        va.value = Cast.toNumber(va.value) + Cast.toNumber(args.VALUE);
      }
    }

    setOrChangeMyValueWithKey(args, util) {
      this.setOrChangeDataOfTarget(util.target, Cast.toString(args.KEY), args.OP, args.VALUE);
    }

    recordDataKeyForTarget(target, key) {
      let record = target[recommendKeySymbol];
      if (!record) {
        record = recommendKeysRecords.get(target.sprite);
        if (!record) {
          record = new Set();
          recommendKeysRecords.set(target.sprite, record);
        }
      }
      record.add(key);
    }

    setOrChangeDataOfTarget(target, key, op, value) {
      const data = this.getExtraDataOfTarget(target);
      // this.recordDataKeyForTarget(target, key);
      if (op === 'set') {
        data[key] = value;
      } else {
        data[key] = Cast.toNumber(data[key]) + Cast.toNumber(value);
      }
    }

    getMyProperty(args, util) {
      return this.propertyOfTarget(util.target, args.PROPERTY);
    }

    myID(args, util) {
      return this.getIDOfTarget(util.target);
    }

    mySpriteName(args, util) {
      return util.target.sprite.name;
    }

    mySpriteID(args, util) {
      return this.getIDOfTarget(util.target.sprite.clones[0]);
    }

    getClonePropertyWithID(args) {
      const target = this.getTargetByID(Cast.toString(args.ID));
      if (!target) return '';
      return this.propertyOfTarget(target, args.PROPERTY);
    }

    propertyOfTarget(target, type) {
      switch (type) {
        case '_x': 
          return target.x;
        case '_y':
          return target.y;
        case '_size':
          return target.size;
        case '_visible':
          return target.visible;
        case 'currentCostume':
          return target.currentCostume + 1;
        case 'currentCostumeName':
          return target.sprite.costumes[target.currentCostume].name;
        case 'name':
          return target.sprite.name;
        case 'id':
          // 获取 ID 时，返回虚拟ID
          return this.getIDOfTarget(target);
        case 'dataJSON':
          // 获取KV数据JSON
          return JSON.stringify(this.getExtraDataOfTarget(target));
        case 'dataObj':
          if (this.runtime.SafeObject) {
            return new this.runtime.SafeObject(this.getExtraDataOfTarget(target));
          }
          return 'Error: Need to install Advanecd Data Structure Extension first!';
        case 'color':
        case 'fisheye':
        case 'whirl':
        case 'pixelate':
        case 'brightness':
        case 'ghost':
        case 'mosaic':
          return target.effects[type] ?? 0;
        default:
          return target[type] ?? '';
      }
    }

    _getClonesOfSprite(sprite, util) {
      const spriteName = Cast.toString(sprite);
      if (spriteName === CONST.MYSELF) {
        return util.target.sprite.clones.slice(1);
      }
      if (spriteName === CONST.ALL) {
        return this.runtime.targets.filter((target) => !target.isOriginal);
      }
      return this.runtime.targets.filter((target) => !target.isOriginal && target.sprite.name === spriteName);
    }

    searchCloneWithKV({ SPRITE, KEY, VALUE }, util) {
      const targets = this._getClonesOfSprite(SPRITE, util);
      const key = Cast.toString(KEY);
      const target = targets.find((target) => Cast.compare(VALUE, this.getDataOfTarget(target, key)) === 0);
      if (target) return this.getIDOfTarget(target);
      return '';
    }

    getCloneTargetPropertyWithSpriteName(args, util) {
      return this.getCloneTargetPropertyWithSpriteName2(args, util);
    }

    getCloneTargetPropertyWithSpriteName2(args, util) {
      const targets = this._getClonesOfSprite(args.TARGET, util);
      let value;
      switch (args.PROPERTY) {
        case 'count':
          value = targets.length;
          break;
        case 'json':
          value = JSON.stringify(targets);
          break;
        case 'IDList':
          value = JSON.stringify(targets.map((target) => this.getIDOfTarget(target)));
          break;
        default:
          value = '';
          break;
      }
      return value;
    }

    getOriginalTargetPropertyWithSpriteName(args, util) {
      return this.getOriginalTargetPropertyWithSpriteName2(args, util);
    }

    getOriginalTargetPropertyWithSpriteName2(args, util) {
      const target = this._getSpriteByNameOrMyself(args.TARGET, util);
      if (!target) return '';
      return this.propertyOfTarget(target, args.PROPERTY);
    }

    _getSpriteByNameOrMyself(name, util) {
      if (name === CONST.MYSELF) return util.target.sprite.clones[0];
      return this.runtime.getSpriteTargetByName(name);
    }

    spriteID(args, util) {
      const target = this._getSpriteByNameOrMyself(args.TARGET, util);
      if (!target) return '';
      return this.getIDOfTarget(target);
    }
  }

  
// #endregion
// --------------- END src/dollyPro/extension.js --------------- 

  // #region --------------- START: src/main.js --------------- 

  // import Extension from './advanceControl/高级控制新版.js';
  // import Extension from './函数.js';

  Scratch.extensions.register(new DollyProExtension(Scratch.vm.runtime));

  
// #endregion
// --------------- END src/main.js --------------- 

})();

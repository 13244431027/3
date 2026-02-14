let data_block_URI = 0
let yuedengyu_jingdu = 1 
let lin_shuju_key = []
let lin_shuju_value = []


function getRandomInt(x, y) {
    return Math.floor(Math.random() * (y - x + 1)) + Number(x);
}
function getRandomFloat(a, b) {
  return Math.random() * (Number(b) - Number(a)) + Number(a);
}
function num(x){
    return Number(x)
}
function removeAllOccurrences(str, substr) {
    return str.replace(new RegExp(substr, 'g'), '');
}
class myextend {
    getInfo() {
        return{
            id:"operator",//最后要给扩展id去掉S
            name:"运算",
            //基本代码完成
            color1:"#59c059",
            color2:"#46b946",
            color3:"#389438",
            menuIconURI:"https://m.ccw.site/creator-college/images/bff01583a0cf781c980a039efcd9d859.svg",
            
            //又完成了
            blocks:[ 
                {
                    opcode:'yunsuanblock_1',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[temp]+[temp2]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_1_5',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[temp]+[temp2]+[temp3]+[temp4]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        temp3:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        temp4:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_2',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[temp]-[temp2]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_2_5',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[temp]-[temp2]-[temp3]-[temp4]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        temp3:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        temp4:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_3',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[temp]*[temp2]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_4',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[temp]/[temp2]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_5',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[temp]的[temp2]次方',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_5_5',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[temp]√[temp2]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_5_6',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'log10[temp2]',
                    arguments:{
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                    }
                }, 
                "---",
                {
                    opcode:'yunsuanblock_6',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'在[temp]和[temp2]之间的随机整数',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:1,
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:10,
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_6_5',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'在[temp]和[temp2]之间的随机小数',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:1,
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:10,
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_6_6',
                    blockType:Scratch.BlockType.BOOLEAN, //普通积木块
                    text:'[temp]分之一的概率',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:1,
                        },
                    }
                }, 
                "---",
                {
                    opcode:'yunsuanblock_7',
                    blockType:Scratch.BlockType.BOOLEAN, //普通积木块
                    text:'[temp]>[temp2]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:50,
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_7_5',
                    blockType:Scratch.BlockType.BOOLEAN, //普通积木块
                    text:'[temp]>[temp2]>[temp3]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:50,
                        },
                        temp3:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:100,
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_8',
                    blockType:Scratch.BlockType.BOOLEAN, //普通积木块
                    text:'[temp]<[temp2]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:50,
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_8_5',
                    blockType:Scratch.BlockType.BOOLEAN, //普通积木块
                    text:'[temp]<[temp2]<[temp3]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:50,
                        },
                        temp3:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:100,
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_9',
                    blockType:Scratch.BlockType.BOOLEAN, //普通积木块
                    text:'[temp]=[temp2]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:" ",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:50,
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_9_1',
                    blockType:Scratch.BlockType.BOOLEAN, //普通积木块
                    text:'[temp]=[temp2]=[temp3]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:50,
                        },
                        temp2:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:50,
                        },
                        temp3:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:50,
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_10',
                    blockType:Scratch.BlockType.BOOLEAN, //普通积木块
                    text:'[temp]<=[temp2]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:50,
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_11',
                    blockType:Scratch.BlockType.BOOLEAN, //普通积木块
                    text:'[temp]>=[temp2]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:50,
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_11_5',
                    blockType:Scratch.BlockType.BOOLEAN, //普通积木块
                    text:'[temp]≠[temp2]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:" ",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:50,
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_22_1',
                    blockType:Scratch.BlockType.BOOLEAN, //普通积木块
                    text:'[temp]约等于[temp2]，误差数为[temp3]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:1,
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:2,
                        },
                        temp3:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:1.5,
                        },
                    }
                },
                "---",
                {
                    opcode:'yunsuanblock_12',
                    blockType:Scratch.BlockType.BOOLEAN, //普通积木块
                    text:'[temp]与[temp2]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.BOOLEAN,
                        },
                        temp2:{
                            type:Scratch.ArgumentType.BOOLEAN,
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_12_5',
                    blockType:Scratch.BlockType.BOOLEAN, //普通积木块
                    text:'[temp]与[temp2]与[temp3]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.BOOLEAN,
                        },
                        temp2:{
                            type:Scratch.ArgumentType.BOOLEAN,
                        },
                        temp3:{
                            type:Scratch.ArgumentType.BOOLEAN,
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_13',
                    blockType:Scratch.BlockType.BOOLEAN, //普通积木块
                    text:'[temp]或[temp2]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.BOOLEAN,
                        },
                        temp2:{
                            type:Scratch.ArgumentType.BOOLEAN,
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_13_2',
                    blockType:Scratch.BlockType.BOOLEAN, //普通积木块
                    text:'[temp]或[temp2]或[temp3]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.BOOLEAN,
                        },
                        temp2:{
                            type:Scratch.ArgumentType.BOOLEAN,
                        },
                        temp3:{
                            type:Scratch.ArgumentType.BOOLEAN,
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_14',
                    blockType:Scratch.BlockType.BOOLEAN, //普通积木块
                    text:'[temp]不成立',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.BOOLEAN,
                        },
                    }
                }, 
                "---",
                {
                    opcode:'yunsuanblock_15_5',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[temp]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"苹果",
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_15_6',
                    blockType:Scratch.BlockType.BOOLEAN, //普通积木块
                    text:'[temp]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"香蕉",
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_15_7',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[temp]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.BOOLEAN,
                        },
                    }
                }, 
                 {
                    opcode:'yunsuanblock_15_8',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[temp]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.REPORTER,
                        },
                    }
                }, 
                
                "---",

                {
                    opcode:'yunsuanblock_15',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'连接[temp]和[temp2]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"苹果",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"香蕉",
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_16',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'连接[temp],[temp2]和[temp3]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"苹果",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"香蕉",
                        },
                        temp3:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"草莓",
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_17',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[temp]的第[temp2]个字符',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"苹果",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:1,
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_17_5',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[temp]的第[temp2]到[temp3]个字符',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"苹果",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:1,
                        },
                        temp3:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:2,
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_17_6',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[temp]删除[menu1][temp2]的字符串',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"苹果",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"果",
                        },
                        menu1:{
                            type:Scratch.ArgumentType.STRING,
                            menu:"shachuStringleixing",
                        },
                    }
                },
                {
                    opcode:'yunsuanblock_17_7',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[temp]中，[temp2]的字符串替为[temp3]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"香蕉果",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"蕉",
                        },
                        temp3:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"苹",
                        },
                    }
                },
                {
                    opcode:'yunsuanblock_18',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[temp]的字符数',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"苹果",
                        },
                    }
                }, 
                {
                    opcode:'yunsuanblock_19',
                    blockType:Scratch.BlockType.BOOLEAN, //普通积木块
                    text:'[temp]包含[temp2]?',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"苹果",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"果",
                        },
                    }
                },
                {
                    opcode:'yunsuanblock_19_666',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[temp]重复[temp2]次',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"我爱吃香蕉",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:10,
                        },
                    }
                },
                {
                    opcode:'yunsuanblock_19_777',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'如果[temp]那么[temp2]否则[temp3]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.BOOLEAN,
                        },
                        temp2:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"苹果",
                        },
                        temp3:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"香蕉",
                        },
                    }
                },
                "---",
                 {
                    opcode:'yunsuanblock_20',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[temp]除以[temp2]的余数',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                    }
                },
                {
                    opcode:'yunsuanblock_20_1',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[temp]接近[temp2]，速率为[temp3]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:25,
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:50,
                        },
                        temp3:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:2,
                        },
                    }
                },
                {
                    opcode:'yunsuanblock_21',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'四舍五入[temp]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                    }
                },
                {
                    opcode:'yunsuanblock_21_5',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'将[temp]保留[temp2]位小数',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:3.141,
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:2,
                        },
                    }
                },
                {
                    opcode:'yunsuanblock_22',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[temp]与[temp3]中的[lister]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        temp3:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        lister:{
                            type:Scratch.ArgumentType.STRING,
                            menu:"daxiaozhi",
                        },
                    }
                },
                {
                    opcode:'yunsuanblock_22_5',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'-[temp]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:1,
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                    }
                },
                "---",
                {
                    opcode:'yunsuanblock_23',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[lister][temp]的值',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:" ",
                        },
                        lister:{
                            type:Scratch.ArgumentType.STRING,
                            menu:"hanshu",
                        },
                    }
                },
                 {
                    opcode:'yunsuanblock_24',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'[temp]°',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:1,
                        },
                        lister:{
                            type:Scratch.ArgumentType.STRING,
                            menu:"hanshu",
                        },
                    }
                },
                {
                    opcode:'yunsuanblock_25',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'常量[lister]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:1,
                        },
                        lister:{
                            type:Scratch.ArgumentType.STRING,
                            menu:"changliang",
                        },
                    }
                },
                "---",
                {
                    opcode:'yunsuanblock_26',
                    blockType:Scratch.BlockType.COMMAND, //普通积木块
                    text:'数据[temp]设为[temp2]',
                    blockIconURI:data_block_URI,
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"key",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"0",
                        },
                    }
                },
                {
                    opcode:'yunsuanblock_26_5',
                    blockType:Scratch.BlockType.COMMAND, //普通积木块
                    text:'数据[temp]增加[temp2]',
                    blockIconURI:data_block_URI,
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"key",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"1",
                        },
                    }
                },
                {
                    opcode:'yunsuanblock_26_6',
                    blockType:Scratch.BlockType.COMMAND, //普通积木块
                    text:'交换数据[temp][temp2]的值',
                    blockIconURI:data_block_URI,
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"key",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"key2",
                        },
                    }
                },
                {
                    opcode:'yunsuanblock_27',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'数据[temp]',
                    blockIconURI:data_block_URI,

                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"key",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"0",
                        },
                    }
                },
                {
                    opcode:'yunsuanblock_28',
                    blockType:Scratch.BlockType.BOOLEAN, //普通积木块
                    text:'存在数据[temp]?',
                    blockIconURI:data_block_URI,

                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"key",
                        },
                        temp2:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"0",
                        },
                    }
                },
                "---",

                
                {
                    opcode:'yunsuanblock_29',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'计算半径为[temp]的圆形的[temp2]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:10,
                        },
                        temp2:{
                            type:Scratch.ArgumentType.STRING,
                            menu:"mianjizhouchang",
                        },
                    }
                },
                {
                    opcode:'yunsuanblock_30',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'计算半径为[temp],圆心角度数为[temp3]的扇形的[temp2]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:10,
                        },
                        temp3:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:90,
                        },
                        temp2:{
                            type:Scratch.ArgumentType.STRING,
                            menu:"mianjizhouchang",
                        },
                    }
                },
                {
                    opcode:'yunsuanblock_31',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'计算高为[temp],底为[temp2]三角形的[temp3]',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:10,
                        },
                        temp2:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:10,
                        },
                        temp3:{
                            type:Scratch.ArgumentType.STRING,
                            menu:"mianjizhouchang",
                        },
                    }
                },

                "---",


                {
                    opcode:'yunsuanblock_32',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'Unicode[temp]对应的字符',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.NUMBER,
                            defaultValue:114513,
                        },
                    }
                },
                {
                    opcode:'yunsuanblock_33',
                    blockType:Scratch.BlockType.REPORTER, //普通积木块
                    text:'字符[temp]的unicode值',
                    arguments:{
                        temp:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:"💵",
                        },
                    }
                },
                
                


               
            ],
            menus:{
                daxiaozhi:{
                    acceptReporters:false,
                    items:["最大值","最小值","中间值"]
                },
                hanshu:{
                    acceptReporters:false,
                    items:["绝对值","cos","tan","sin","sec","csc","cot","arccos","arctan","arcsin","cosh","tanh","sinh","arccosh","arctanh","arcsinh"]
                },
                changliang:{
                    acceptReporters:false,
                    items:["圆周率","e","无穷大","null","未定义","不是数字","true","false","换行符"]
                },
                mianjizhouchang:{
                    acceptReporters:false,
                    items:["面积","周长"]
                },
                shachuStringleixing:{
                    acceptReporters:false,
                    items:["一个","全部"]
                },
            }    
        }
    }
    
    yunsuanblock_1(args){
        return Number(args.temp) + Number(args.temp2)
    }
    

    yunsuanblock_1_5(args){
        return Number(args.temp) + Number(args.temp2) + Number(args.temp3) + Number(args.temp4)
    }
    yunsuanblock_2(args){
        return Number(args.temp) - Number(args.temp2)
    }
    yunsuanblock_2_5(args){
        return Number(args.temp) - Number(args.temp2) - Number(args.temp3) - Number(args.temp4)
    }
    yunsuanblock_3(args){
        return Number(args.temp) * Number(args.temp2)
    }
    yunsuanblock_4(args){
        return Number(args.temp) / Number(args.temp2)
    }
    yunsuanblock_5(args){
        return Number(args.temp) ** Number(args.temp2)
    }
    yunsuanblock_5_5(args){
        return Number(args.temp2) ** (1/Number(args.temp))
    }
    yunsuanblock_5_6(args){
        return Number(Math.log10(args.temp2))
    }
    yunsuanblock_6(args){
        return getRandomInt(args.temp,args.temp2)
    }
    yunsuanblock_6_5(args){
        return getRandomFloat(args.temp,args.temp2)
    }
    yunsuanblock_6_6(args){
        if(args.temp <= 1){
            return true
        }
        if(getRandomInt(1,args.temp) == 1){
            return true
        }else{
            return false
        }
    }
    yunsuanblock_7(args){
        if(Number(args.temp) > Number(args.temp2)){
            return true
        }else{
            return false
        }
    }
    yunsuanblock_7_5(args){
        if( Number(args.temp) > Number(args.temp2) && Number(args.temp2) > Number(args.temp3) ){
            return true
        }else{
            return false
        }
    }
    yunsuanblock_8(args){
        if(Number(args.temp) < Number(args.temp2)){
            return true
        }else{
            return false
        }
    }
    yunsuanblock_8_5(args){
        if( Number(args.temp) < Number(args.temp2) && Number(args.temp2) < Number(args.temp3) ){
            return true
        }else{
            return false
        }
    }
    yunsuanblock_9(args){
        if(args.temp == args.temp2){
            return true
        }else{
            return false
        }
    }
    yunsuanblock_9_1(args){
        if(args.temp == args.temp2 && args.temp2 == args.temp3 && args.temp == args.temp3){
            return true
        }else{
            return false
        }
    }
    yunsuanblock_10(args){
        if(Number(args.temp) <= Number(args.temp2)){
            return true
        }else{
            return false
        }
    }
    yunsuanblock_11(args){
        if(Number(args.temp) >= Number(args.temp2)){
            return true
        }else{
            return false
        }
    }
    yunsuanblock_11_5(args){
        if(args.temp == args.temp2){
            return false
        }else{
            return true
        }
    }
    
     yunsuanblock_12(args){
        if(args.temp && args.temp2){
            return true
        }else{
            return false
        }
    }
    yunsuanblock_12_5(args){
        if(args.temp && args.temp2 && args.temp3){
            return true
        }else{
            return false
        }
    }
     yunsuanblock_13(args){
        if(args.temp || args.temp2){
            return true
        }else{
            return false
        }
    }
    yunsuanblock_13_2(args){
        if(args.temp || args.temp2 || args.temp3){
            return true
        }else{
            return false
        }
    }
    yunsuanblock_14(args){
        if(args.temp){
            return false
        }else{
            return true
        }
    }
    yunsuanblock_15_5(args){
        return args.temp
    }
    yunsuanblock_15_6(args){
        return args.temp
    }
    yunsuanblock_15_7(args){
        return args.temp
    }
    yunsuanblock_15_8(args){
        return args.temp
    }
    yunsuanblock_15(args){
        return String(args.temp) + String(args.temp2)
    }
    yunsuanblock_16(args){
        return String(args.temp) + String(args.temp2)+String(args.temp3)
    }
    yunsuanblock_17(args){
        return String(args.temp)[args.temp2-1]
    }
    yunsuanblock_17_5(args){
        return String(args.temp).slice(args.temp2-1,args.temp3)
    }
    yunsuanblock_17_6(args){
        if(args.menu1 == "一个"){
            return args.temp.replace(args.temp2,"")
        }else{
            return removeAllOccurrences(args.temp,args.temp2)
        }
    }
    yunsuanblock_17_7(args){
        return args.temp.replace(args.temp2,args.temp3)
    }
    yunsuanblock_18(args){
        return String(args.temp).length
    }
    yunsuanblock_19(args){
        if(String(args.temp).includes(args.temp2)){
            return true
        }else{
            return false
        }
    }
    yunsuanblock_20(args){
        return Number(args.temp) % Number(args.temp2) 
    }
    yunsuanblock_20_1(args){
        let y20_1_t1 = Number(args.temp)
        let y20_1_t2 = Number(args.temp2)
        let y20_1_t3 = Number(args.temp3)
        return y20_1_t1 + ((y20_1_t2 - y20_1_t1) / y20_1_t3)
    }
    yunsuanblock_21(args){
        return Math.round(Number(args.temp))
    }
    yunsuanblock_21_5(args){
        return Math.round(args.temp * (10 ** args.temp2)) / (10 ** args.temp2) 
    }
    yunsuanblock_22(args){
        if(args.lister == "最大值"){
            if(args.temp > args.temp3){
                return args.temp
            }else{
                return args.temp3
            }
        }else if(args.lister = "最小值"){
             if(args.temp < args.temp3){
                return args.temp
             }else{
                return args.temp3
             }
        }else if(args.lister = "中间值"){
            return Number((Number(args.temp3) + Number(args.temp))) / 2
        }else{
            return "error"
        }
    }
    yunsuanblock_22_5(args){
        return Number(args.temp) * -1
    }
    yunsuanblock_23(args){
        if(args.lister == "绝对值"){
            return Math.abs(Number(args.temp))
        }
        if(args.lister == "cos"){
            return Math.cos(Number(args.temp))
        }
        if(args.lister == "tan"){
            return Math.tan(Number(args.temp))
        }
        if(args.lister == "sin"){
            return Math.sin(Number(args.temp))
        }
        if(args.lister == "arccos"){
            return Math.acos(Number(args.temp))
        }
        if(args.lister == "arctan"){
            return Math.atan(Number(args.temp))
        }
        if(args.lister == "arcsin"){
            return Math.asin(Number(args.temp))
        }
        if(args.lister == "cosh"){
            return Math.cosh(Number(args.temp))
        }
        if(args.lister == "tanh"){
            return Math.tanh(Number(args.temp))
        }
        if(args.lister == "sinh"){
            return Math.sinh(Number(args.temp))
        }
        if(args.lister == "arccosh"){
            return Math.acosh(Number(args.temp))
        }
        if(args.lister == "arcsinh"){
            return Math.asinh(Number(args.temp))
        }
        if(args.lister == "arctanh"){
            return Math.atanh(Number(args.temp))
        }
        //不准他人使用下面这些代码↓（已经被抄袭怕了😱）
        if(args.lister == "sec"){
            return 1 / Math.cos(Number(args.temp))
        }
        if(args.lister == "cot"){
            return 1 / Math.tan(Number(args.temp))
        }
        if(args.lister == "csc"){
            return 1 / Math.sin(Number(args.temp))
        }
        //↑
    }
    yunsuanblock_24(args){
        return args.temp * (Math.PI/180)
    }
    yunsuanblock_25(args){
        if(args.lister == "圆周率"){
            return Math.PI
        }
        if(args.lister == "e"){
            return Math.E
        }
        if(args.lister == "无穷大"){
            return Infinity
        }
        if(args.lister == "null"){
            return null
        }
        if(args.lister == "未定义"){
            return undefined
        }
        if(args.lister == "不是数字"){
            return NaN
        }
        if(args.lister == "true"){
            return true
        }
        if(args.lister == "false"){
            return false
        }
        if(args.lister == "换行符"){
            return String.fromCharCode(10);
        }
    }
    yunsuanblock_26(args){
        if(lin_shuju_key.includes(args.temp)){
            lin_shuju_value[lin_shuju_key.indexOf(args.temp)] = args.temp2
        }else{
            lin_shuju_key.push(args.temp)
            lin_shuju_value.push(args.temp2)
        }
    }
    yunsuanblock_26_5(args){
        if(lin_shuju_key.includes(args.temp)){
            lin_shuju_value[lin_shuju_key.indexOf(args.temp)] = Number(Number(Number(lin_shuju_value[lin_shuju_key.indexOf(args.temp)])) + Number(Number(args.temp2)))
        }
    }
    yunsuanblock_26_6(args){
        const block26_6i = lin_shuju_value[lin_shuju_key.indexOf(args.temp)]
        lin_shuju_value[lin_shuju_key.indexOf(args.temp)] = lin_shuju_value[lin_shuju_key.indexOf(args.temp2)]
        lin_shuju_value[lin_shuju_key.indexOf(args.temp2)] = block26_6i
    }
    yunsuanblock_27(args){
        
            return lin_shuju_value[lin_shuju_key.indexOf(args.temp)]
        
        
    }
    yunsuanblock_28(args){
        if(lin_shuju_key.includes(args.temp)){
            return true
        }else{
            return false
        }
    }
    yunsuanblock_29(args){
        if(args.temp2 == "面积"){
            return Math.PI * (args.temp ** 2)
        }else{
            return Math.PI * (args.temp * 2)
        }
        
    }
     yunsuanblock_30(args){
        if(args.temp2 == "面积"){
            return (Math.PI * (args.temp ** 2)) / 360 * args.temp3
        }else{
            return (Math.PI * (args.temp * 2) / 360 * args.temp3) + (args.temp * 2)
        }
        
    }
     yunsuanblock_31(args){
        if(args.temp3 == "面积"){
            return (args.temp * args.temp2) /2
        }else{
            return (args.temp+2*Math.sqrt((args.temp**2)/4+(args.temp2**2)))
        }
        
    }
    yunsuanblock_19_666(args){
        let yunsuanblock_19_666_v = args.temp
        if(yunsuanblock_19_666_v.repeat(args.temp2).length >= 55555){
            return "⚠检测到炸机行为⚠"
        }
        return yunsuanblock_19_666_v.repeat(args.temp2)
    }
    yunsuanblock_19_777(args){
        if(args.temp){
            return args.temp2
        }else{
            return args.temp3
        }
    }
    yunsuanblock_22_1(args){
        return (Math.abs(args.temp - args.temp2) <= args.temp3)
    }
    yunsuanblock_32(args){
        return String.fromCharCode(args.temp)
    }
    yunsuanblock_33(args){
        return args.temp.charCodeAt(0);
    }
    
    
}
Scratch.extensions.register(new myextend())
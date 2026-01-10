(function (Scratch) {
  "use strict";

  class BPixelCockatiel {
    getInfo() {
      return {
        id: "BPixelCockatiel",
        name: "鹦鹉定位",
        color1: "#FFA500",
        color2: "#FFD700",
        blocks: [
          {
            opcode: "myIP",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: "我的IP地址 [version]",
            arguments: {
              version: {
                type: Scratch.ArgumentType.STRING,
                menu: "ipVersionMenu"
              }
            }
          },
          {
            opcode: "longitude",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: "经度"
          },
          {
            opcode: "latitude",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: "纬度"
          },
          {
            opcode: "myInfo",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: "我的 [info]",
            arguments: {
              info: {
                type: Scratch.ArgumentType.STRING,
                menu: "infoMenu"
              }
            }
          },
          {
            opcode: "isUsingVPN",
            blockType: Scratch.BlockType.BOOLEAN,
            disableMonitor: true,
            text: "正在使用VPN？"
          },
          {
            opcode: "publicIP",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: "公网IP地址"
          },
          {
            opcode: "myTimezone",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: "我的时区"
          },
          {
            opcode: "distanceBetweenIPs",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: "IP [ip1] 和 IP [ip2] 之间的距离",
            arguments: {
              ip1: {
                type: Scratch.ArgumentType.NUMBER
              },
              ip2: {
                type: Scratch.ArgumentType.NUMBER
              }
            }
          },
          {
            opcode: "storeCurrentIP",
            blockType: Scratch.BlockType.COMMAND,
            text: "存储当前IP地址",
            hideFromPalette: true // 我不太喜欢存储人们的IP地址。也许有人会改变这一点
          },
          {
            opcode: "getStoredIP",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: "获取存储的IP地址",
            hideFromPalette: true // 我不太喜欢存储人们的IP地址。也许有人会改变这一点
          }
        ],
        menus: {
          ipVersionMenu: {
            items: ["IPv4", "IPv6"]
          },
          infoMenu: {
            items: ["国家", "运营商", "地区", "城市"]
          }
        }
      };
    }

    async myIP(args) {
      const version = args.version;
      let url = "https://api.ipify.org?format=json"; // 默认使用IPv4
      if (version === "IPv6") url = "https://api64.ipify.org?format=json"; // 对于IPv6
      try {
        const response = await Scratch.fetch(url);
        const data = await response.json();
        return data.ip;
      } catch {
        return "获取IP时出错";
      }
    }

    async longitude() {
      try {
        const response = await Scratch.fetch("https://ipwhois.app/json/");
        const data = await response.json();
        return data.longitude || "不可用";
      } catch {
        return "获取经度时出错";
      }
    }

    async latitude() {
      try {
        const response = await Scratch.fetch("https://ipwhois.app/json/");
        const data = await response.json();
        return data.latitude || "不可用";
      } catch {
        return "获取纬度时出错";
      }
    }

    async myInfo(args) {
      const info = args.info;
      try {
        const response = await Scratch.fetch("https://ipwhois.app/json/");
        const data = await response.json();
        switch (info) {
          case "国家": return data.country || "不可用";
          case "运营商": return data.isp || "不可用";
          case "地区": return data.region || "不可用";
          case "城市": return data.city || "不可用";
          default: return "无效选项";
        }
      } catch {
        return "获取信息时出错";
      }
    }

    async isUsingVPN() {
      try {
        const response = await Scratch.fetch("https://ipwhois.app/json/");
        const data = await response.json();
        return data.is_vpn || false;
      } catch {
        return false;
      }
    }

    async publicIP() {
      try {
        const response = await Scratch.fetch("https://api.ipify.org?format=json"); // 总是获取IPv4
        const data = await response.json();
        return data.ip;
      } catch {
        return "获取公网IP时出错";
      }
    }

    async myTimezone() {
      try {
        const response = await Scratch.fetch("https://ipwhois.app/json/");
        const data = await response.json();
        return data.timezone || "不可用";
      } catch {
        return "获取时区时出错";
      }
    }

    async distanceBetweenIPs(args) {
      const { ip1, ip2 } = args;
      const location1 = await this.fetchLocation(ip1);
      const location2 = await this.fetchLocation(ip2);

      if (location1.latitude && location1.longitude && location2.latitude && location2.longitude) {
        return this.haversineDistance(location1.latitude, location1.longitude, location2.latitude, location2.longitude);
      } else {
        return "未找到结果";
      }
    }

    async fetchLocation(ip) {
      try {
        const response = await Scratch.fetch(`https://ipwhois.app/json/${ip}`);
        const data = await response.json();
        return {
          latitude: data.latitude, longitude: data.longitude
        };
      } catch (error) {
        return {
          latitude: null, longitude: null
        };
      }
    }

    haversineDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // 地球半径，单位：公里
      const dLat = this.degreesToRadians(lat2 - lat1);
      const dLon = this.degreesToRadians(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // 距离，单位：公里
    }

    degreesToRadians(degrees) {
      return degrees * (Math.PI / 180);
    }

    async storeCurrentIP() {
      try {
        const ip = await this.myIP({version: "IPv4"}); // 存储IPv4 IP
        localStorage.setItem("currentIP", ip);
        return "IP存储成功";
      } catch {
        return "存储IP时出错";
      }
    }

    getStoredIP() {
      const ip = localStorage.getItem("currentIP");
      if (ip) return ip;
      else return "未存储IP";
    }
  }

  Scratch.extensions.register(new BPixelCockatiel());
})(Scratch);
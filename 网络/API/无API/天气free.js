(function(Scratch) {
  'use strict';
  
  class WeatherExtension {
    constructor() {
      this.currentWeatherData = null;
      this.lastFetchTime = 0;
      this.cacheDuration = 600000;
      this.favoriteLocations = [];
      this.weatherHistory = [];
      this.maxHistorySize = 50;
      this.userPreferences = {
        defaultUnit: '℃',
        defaultWindUnit: 'km/h',
        language: 'zh'
      };
    }
    
    getInfo() {
      return {
        id: 'weatherextension',
        name: '🌤️ 高级天气扩展',
        color1: '#4A90E2',
        color2: '#357ABD',
        color3: '#2C6CB3',
        blocks: [
          {
            opcode: 'getWeather',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取 [LOCATION] 的天气',
            arguments: {
              LOCATION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '北京'
              }
            }
          },
          {
            opcode: 'getTemperature',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取 [LOCATION] 的温度 (单位: [UNIT])',
            arguments: {
              LOCATION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '北京'
              },
              UNIT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'UNIT_MENU'
              }
            }
          },
          {
            opcode: 'getDetailedWeather',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取 [LOCATION] 的详细天气 (格式: [FORMAT])',
            arguments: {
              LOCATION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '北京'
              },
              FORMAT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'FORMAT_MENU'
              }
            }
          },
          "---",
          {
            opcode: 'getWeatherForecast',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取 [LOCATION] 的 [PERIOD] 预报',
            arguments: {
              LOCATION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '北京'
              },
              PERIOD: {
                type: Scratch.ArgumentType.STRING,
                menu: 'PERIOD_MENU'
              }
            }
          },
          {
            opcode: 'getHourlyWeather',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取 [LOCATION] 的 [HOUR] 小时预报',
            arguments: {
              LOCATION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '北京'
              },
              HOUR: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 6
              }
            }
          },
          {
            opcode: 'getWeeklySummary',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取 [LOCATION] 的周天气摘要',
            arguments: {
              LOCATION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '北京'
              }
            }
          },
          "---",
          {
            opcode: 'getWeatherAlerts',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取 [LOCATION] 的天气警报',
            arguments: {
              LOCATION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '北京'
              }
            }
          },
          {
            opcode: 'getAirQuality',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取 [LOCATION] 的空气质量',
            arguments: {
              LOCATION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '北京'
              }
            }
          },
          {
            opcode: 'getPollenInfo',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取 [LOCATION] 的花粉信息',
            arguments: {
              LOCATION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '北京'
              }
            }
          },
          "---",
          {
            opcode: 'getAstronomyData',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取 [LOCATION] 的 [ASTRONOMY_TYPE] 时间',
            arguments: {
              LOCATION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '北京'
              },
              ASTRONOMY_TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'ASTRONOMY_MENU'
              }
            }
          },
          {
            opcode: 'getMoonPhaseInfo',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取月相信息 [DATE]',
            arguments: {
              DATE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '今天'
              }
            }
          },
          {
            opcode: 'getSeasonInfo',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取 [LOCATION] 的季节信息',
            arguments: {
              LOCATION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '北京'
              }
            }
          },
          "---",
          {
            opcode: 'compareLocations',
            blockType: Scratch.BlockType.REPORTER,
            text: '比较 [LOCATION1] 和 [LOCATION2] 的 [COMPARE_TYPE]',
            arguments: {
              LOCATION1: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '北京'
              },
              LOCATION2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '上海'
              },
              COMPARE_TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'COMPARE_MENU'
              }
            }
          },
          {
            opcode: 'getWeatherTrend',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取 [LOCATION] 的天气趋势',
            arguments: {
              LOCATION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '北京'
              }
            }
          },
          {
            opcode: 'calculateComfortIndex',
            blockType: Scratch.BlockType.REPORTER,
            text: '计算 [LOCATION] 的舒适度指数',
            arguments: {
              LOCATION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '北京'
              }
            }
          },
          "---",
          {
            opcode: 'getTravelWeather',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取 [DESTINATION] 的旅行天气建议 (从 [ORIGIN])',
            arguments: {
              DESTINATION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '三亚'
              },
              ORIGIN: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '北京'
              }
            }
          },
          {
            opcode: 'getActivityRecommendation',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取 [LOCATION] 的 [ACTIVITY] 活动建议',
            arguments: {
              LOCATION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '北京'
              },
              ACTIVITY: {
                type: Scratch.ArgumentType.STRING,
                menu: 'ACTIVITY_MENU'
              }
            }
          },
          {
            opcode: 'getClothingAdvice',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取 [LOCATION] 的穿衣建议',
            arguments: {
              LOCATION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '北京'
              }
            }
          },
          "---",
          {
            opcode: 'getHistoricalWeather',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取 [LOCATION] 的历史天气 [DAYS] 天前',
            arguments: {
              LOCATION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '北京'
              },
              DAYS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'getWeatherStatistics',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取 [LOCATION] 的天气统计',
            arguments: {
              LOCATION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '北京'
              }
            }
          },
          {
            opcode: 'getExtremeWeather',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取 [LOCATION] 的极端天气记录',
            arguments: {
              LOCATION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '北京'
              }
            }
          },
          "---",
          {
            opcode: 'setUserPreference',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置偏好 [PREFERENCE] 为 [VALUE]',
            arguments: {
              PREFERENCE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'PREFERENCE_MENU'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'VALUE_MENU'
              }
            }
          },
          {
            opcode: 'getSystemStatus',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取系统状态'
          }
        ],
        menus: {
          UNIT_MENU: {
            items: ['℃', '℉']
          },
          FORMAT_MENU: {
            items: ['简洁', '详细', 'JSON', '表格']
          },
          PERIOD_MENU: {
            items: ['今天', '明天', '3天', '一周']
          },
          ASTRONOMY_MENU: {
            items: ['日出', '日落', '月出', '月落', '日照时长']
          },
          COMPARE_MENU: {
            items: ['温度', '湿度', '风速', '天气状况', '综合']
          },
          ACTIVITY_MENU: {
            items: ['户外运动', '旅游观光', '摄影', '钓鱼', '野餐', '滑雪']
          },
          PREFERENCE_MENU: {
            items: ['温度单位', '风速单位', '语言']
          },
          VALUE_MENU: {
            items: ['℃', '℉', 'km/h', 'm/s', 'mph', '中文', '英文']
          }
        }
      };
    }

    async fetchWeatherData(location) {
      const now = Date.now();
      
      // 检查缓存
      if (this.currentWeatherData && 
          this.currentWeatherData.location === location && 
          (now - this.lastFetchTime) < this.cacheDuration) {
        return this.currentWeatherData;
      }
      
      try {
        const encodedLocation = encodeURIComponent(location);
        const response = await fetch(`https://wttr.in/${encodedLocation}?format=j1&lang=${this.userPreferences.language === '英文' ? 'en' : 'zh'}`);
        
        if (!response.ok) {
          throw new Error(`HTTP错误! 状态码: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 添加到历史记录
        this.addToHistory(location, data);
        
        this.currentWeatherData = {
          location: location,
          data: data,
          timestamp: now
        };
        
        this.lastFetchTime = now;
        return this.currentWeatherData;
        
      } catch (error) {
        console.error('获取天气数据失败:', error);
        throw new Error(`无法获取 ${location} 的天气数据`);
      }
    }

    addToHistory(location, data) {
      const historyItem = {
        location: location,
        data: JSON.parse(JSON.stringify(data)),
        timestamp: Date.now()
      };
      
      this.weatherHistory.unshift(historyItem);
      
      if (this.weatherHistory.length > this.maxHistorySize) {
        this.weatherHistory = this.weatherHistory.slice(0, this.maxHistorySize);
      }
    }

    // 基础天气功能
    async getWeather(args) {
      try {
        const weatherData = await this.fetchWeatherData(args.LOCATION);
        const current = weatherData.data.current_condition[0];
        const emoji = await this.getWeatherEmoji({LOCATION: args.LOCATION});
        
        return `${emoji} ${args.LOCATION}: ${current.weatherDesc[0].value} ${current.temp_C}℃`;
      } catch (error) {
        return error.message;
      }
    }

    async getTemperature(args) {
      try {
        const weatherData = await this.fetchWeatherData(args.LOCATION);
        const current = weatherData.data.current_condition[0];
        const unit = args.UNIT || this.userPreferences.defaultUnit;
        
        return unit === '℉' ? current.temp_F : current.temp_C;
      } catch (error) {
        return error.message;
      }
    }

    async getDetailedWeather(args) {
      try {
        const weatherData = await this.fetchWeatherData(args.LOCATION);
        const current = weatherData.data.current_condition[0];
        const astronomy = weatherData.data.weather[0].astronomy[0];
        const emoji = await this.getWeatherEmoji({LOCATION: args.LOCATION});
        
        switch (args.FORMAT) {
          case '详细':
            return `${emoji} ${args.LOCATION} 详细天气报告：
🌡️ 温度: ${current.temp_C}℃ (体感 ${current.FeelsLikeC}℃)
☁️ 天气: ${current.weatherDesc[0].value}
💧 湿度: ${current.humidity}%
💨 风速: ${current.windspeedKmph} km/h
🧭 风向: ${current.winddir16Point}
📊 气压: ${current.pressure} hPa
👁️ 能见度: ${current.visibility} km
☀️ 紫外线: ${current.uvIndex || '未知'}
🌅 日出: ${astronomy.sunrise} 🌇 日落: ${astronomy.sunset}`;
            
          case 'JSON':
            return JSON.stringify({
              location: args.LOCATION,
              temperature: current.temp_C,
              feelsLike: current.FeelsLikeC,
              condition: current.weatherDesc[0].value,
              humidity: current.humidity,
              windSpeed: current.windspeedKmph,
              windDirection: current.winddir16Point,
              pressure: current.pressure,
              visibility: current.visibility,
              uvIndex: current.uvIndex,
              sunrise: astronomy.sunrise,
              sunset: astronomy.sunset
            }, null, 2);
            
          case '表格':
            return `📍 ${args.LOCATION}
🌡️  ${current.temp_C}℃ | 💧 ${current.humidity}%
💨  ${current.windspeedKmph}km/h | 📊 ${current.pressure}hPa
🌅 ${astronomy.sunrise} | 🌇 ${astronomy.sunset}`;
            
          default: // 简洁
            return `${emoji} ${args.LOCATION}: ${current.weatherDesc[0].value} ${current.temp_C}℃`;
        }
      } catch (error) {
        return error.message;
      }
    }

    // 天气预报功能
    async getWeatherForecast(args) {
      try {
        const weatherData = await this.fetchWeatherData(args.LOCATION);
        const weather = weatherData.data.weather;
        
        let forecastText = `${args.LOCATION} 天气预报:\n`;
        
        switch (args.PERIOD) {
          case '明天':
            const tomorrow = weather[1];
            forecastText += `明天: ${tomorrow.hourly[4].weatherDesc[0].value} ${tomorrow.mintempC}~${tomorrow.maxtempC}℃`;
            break;
            
          case '3天':
            for (let i = 0; i < 3; i++) {
              const day = weather[i];
              const dayName = i === 0 ? '今天' : i === 1 ? '明天' : '后天';
              forecastText += `${dayName}: ${day.hourly[4].weatherDesc[0].value} ${day.mintempC}~${day.maxtempC}℃\n`;
            }
            break;
            
          case '一周':
            for (let i = 0; i < Math.min(7, weather.length); i++) {
              const day = weather[i];
              const dayName = i === 0 ? '今天' : i === 1 ? '明天' : `第${i+1}天`;
              forecastText += `${dayName}: ${day.hourly[4].weatherDesc[0].value} ${day.mintempC}~${day.maxtempC}℃\n`;
            }
            break;
            
          default: // 今天
            const today = weather[0];
            forecastText += `今天: ${today.hourly[4].weatherDesc[0].value} ${today.mintempC}~${today.maxtempC}℃`;
        }
        
        return forecastText;
      } catch (error) {
        return error.message;
      }
    }

    async getHourlyWeather(args) {
      try {
        const weatherData = await this.fetchWeatherData(args.LOCATION);
        const hourly = weatherData.data.weather[0].hourly;
        
        const hourIndex = Math.min(Math.max(0, Math.floor(args.HOUR / 3)), 7);
        const forecast = hourly[hourIndex];
        
        return `${args.HOUR}小时后: ${forecast.weatherDesc[0].value} ${forecast.tempC}℃ (降水概率: ${forecast.chanceofrain}%)`;
      } catch (error) {
        return error.message;
      }
    }

    async getWeeklySummary(args) {
      try {
        const weatherData = await this.fetchWeatherData(args.LOCATION);
        const weather = weatherData.data.weather;
        
        let summary = `${args.LOCATION} 本周天气摘要:\n`;
        let totalTemp = 0;
        let rainyDays = 0;
        
        for (let i = 0; i < Math.min(7, weather.length); i++) {
          const day = weather[i];
          totalTemp += (parseInt(day.maxtempC) + parseInt(day.mintempC)) / 2;
          
          if (parseInt(day.hourly[4].chanceofrain) > 50) {
            rainyDays++;
          }
        }
        
        const avgTemp = (totalTemp / Math.min(7, weather.length)).toFixed(1);
        summary += `平均温度: ${avgTemp}℃\n`;
        summary += `预计雨天: ${rainyDays}天\n`;
        summary += `主要天气: ${weather[0].hourly[4].weatherDesc[0].value}`;
        
        return summary;
      } catch (error) {
        return error.message;
      }
    }

    // 高级天气信息
    async getWeatherAlerts(args) {
      try {
        const weatherData = await this.fetchWeatherData(args.LOCATION);
        const current = weatherData.data.current_condition[0];
        
        const temp = parseInt(current.temp_C);
        const windSpeed = parseInt(current.windspeedKmph);
        const precip = parseFloat(current.precipMM);
        const visibility = parseInt(current.visibility);
        
        let alerts = [];
        
        if (temp >= 35) alerts.push('🔥 高温预警');
        if (temp <= -10) alerts.push('❄️ 低温预警');
        if (windSpeed >= 50) alerts.push('💨 大风预警');
        if (precip >= 50) alerts.push('🌧️ 暴雨预警');
        if (visibility <= 1) alerts.push('🌫️ 大雾预警');
        if (parseInt(current.uvIndex) >= 8) alerts.push('☀️ 强紫外线预警');
        
        return alerts.length > 0 ? alerts.join(' | ') : '✅ 无天气警报';
      } catch (error) {
        return '无法获取天气警报';
      }
    }

    async getAirQuality(args) {
      try {
        // 模拟空气质量数据（实际需要接入空气质量API）
        const weatherData = await this.fetchWeatherData(args.LOCATION);
        const current = weatherData.data.current_condition[0];
        
        // 基于天气条件估算空气质量
        const humidity = parseInt(current.humidity);
        const windSpeed = parseInt(current.windspeedKmph);
        const pressure = parseInt(current.pressure);
        
        let aqi = 50; // 基础值
        
        // 简单的空气质量估算逻辑
        if (windSpeed > 20) aqi -= 10; // 风大空气质量好
        if (humidity > 80) aqi += 10; // 湿度过高空气质量差
        if (pressure < 1000) aqi += 5; // 低气压空气质量差
        
        aqi = Math.max(0, Math.min(100, aqi));
        
        let level, emoji;
        if (aqi <= 25) { level = '优'; emoji = '💚'; }
        else if (aqi <= 50) { level = '良'; emoji = '💛'; }
        else if (aqi <= 75) { level = '中'; emoji = '🧡'; }
        else { level = '差'; emoji = '❤️'; }
        
        return `${emoji} 空气质量: ${level} (AQI: ${aqi})`;
      } catch (error) {
        return '无法获取空气质量';
      }
    }

    async getPollenInfo(args) {
      try {
        const weatherData = await this.fetchWeatherData(args.LOCATION);
        const current = weatherData.data.current_condition[0];
        
        const temp = parseInt(current.temp_C);
        const humidity = parseInt(current.humidity);
        const windSpeed = parseInt(current.windspeedKmph);
        
        let pollenLevel = '低';
        let emoji = '✅';
        
        // 简单的花粉指数估算
        if (temp >= 15 && temp <= 25 && humidity >= 40 && humidity <= 70 && windSpeed < 20) {
          pollenLevel = '高';
          emoji = '⚠️';
        } else if (temp >= 10 && temp <= 28 && humidity >= 30 && humidity <= 80) {
          pollenLevel = '中';
          emoji = 'ℹ️';
        }
        
        return `${emoji} 花粉指数: ${pollenLevel}`;
      } catch (error) {
        return '无法获取花粉信息';
      }
    }

    // 天文信息
    async getAstronomyData(args) {
      try {
        const weatherData = await this.fetchWeatherData(args.LOCATION);
        const astronomy = weatherData.data.weather[0].astronomy[0];
        
        switch (args.ASTRONOMY_TYPE) {
          case '日出':
            return `🌅 日出时间: ${astronomy.sunrise}`;
          case '日落':
            return `🌇 日落时间: ${astronomy.sunset}`;
          case '月出':
            return `🌙 月出时间: ${astronomy.moonrise || '未知'}`;
          case '月落':
            return `🌙 月落时间: ${astronomy.moonset || '未知'}`;
          case '日照时长':
            // 计算日照时长（简化计算）
            const sunrise = astronomy.sunrise.split(':');
            const sunset = astronomy.sunset.split(':');
            const sunHours = parseInt(sunset[0]) - parseInt(sunrise[0]);
            const sunMinutes = parseInt(sunset[1]) - parseInt(sunrise[1]);
            return `☀️ 日照时长: ${sunHours}小时${sunMinutes}分钟`;
          default:
            return '未知天文数据';
        }
      } catch (error) {
        return error.message;
      }
    }

    async getMoonPhaseInfo(args) {
      try {
        let dateParam = '';
        if (args.DATE !== '今天') {
          dateParam = `@${args.DATE}`;
        }
        
        const response = await fetch(`https://wttr.in/Moon${dateParam}?format=%m&lang=zh`);
        const moonPhase = await response.text();
        
        const phaseMap = {
          '🌑': '新月',
          '🌒': '蛾眉月',
          '🌓': '上弦月',
          '🌔': '盈凸月',
          '🌕': '满月',
          '🌖': '亏凸月',
          '🌗': '下弦月',
          '🌘': '残月'
        };
        
        const phaseEmoji = moonPhase.trim();
        const phaseName = phaseMap[phaseEmoji] || '未知月相';
        
        return `${phaseEmoji} ${phaseName}`;
      } catch (error) {
        return '无法获取月相信息';
      }
    }

    async getSeasonInfo(args) {
      try {
        const weatherData = await this.fetchWeatherData(args.LOCATION);
        const current = weatherData.data.current_condition[0];
        const temp = parseInt(current.temp_C);
        
        let season, emoji;
        if (temp >= 25) {
          season = '夏季';
          emoji = '☀️';
        } else if (temp >= 15) {
          season = '春季';
          emoji = '🌼';
        } else if (temp >= 5) {
          season = '秋季';
          emoji = '🍂';
        } else {
          season = '冬季';
          emoji = '⛄';
        }
        
        return `${emoji} 当前季节特征: ${season}`;
      } catch (error) {
        return '无法获取季节信息';
      }
    }

    // 比较和分析功能
    async compareLocations(args) {
      try {
        const [weather1, weather2] = await Promise.all([
          this.fetchWeatherData(args.LOCATION1),
          this.fetchWeatherData(args.LOCATION2)
        ]);
        
        const current1 = weather1.data.current_condition[0];
        const current2 = weather2.data.current_condition[0];
        
        switch (args.COMPARE_TYPE) {
          case '温度':
            const temp1 = parseInt(current1.temp_C);
            const temp2 = parseInt(current2.temp_C);
            const diff = temp1 - temp2;
            return diff > 0 ? 
              `${args.LOCATION1} 比 ${args.LOCATION2} 高 ${Math.abs(diff)}℃` :
              diff < 0 ? 
              `${args.LOCATION1} 比 ${args.LOCATION2} 低 ${Math.abs(diff)}℃` :
              `两地温度相同`;
              
          case '湿度':
            const hum1 = parseInt(current1.humidity);
            const hum2 = parseInt(current2.humidity);
            return `湿度对比: ${args.LOCATION1} ${hum1}% vs ${args.LOCATION2} ${hum2}%`;
            
          case '风速':
            const wind1 = parseInt(current1.windspeedKmph);
            const wind2 = parseInt(current2.windspeedKmph);
            return `风速对比: ${args.LOCATION1} ${wind1}km/h vs ${args.LOCATION2} ${wind2}km/h`;
            
          case '天气状况':
            return `天气对比: ${args.LOCATION1} ${current1.weatherDesc[0].value} vs ${args.LOCATION2} ${current2.weatherDesc[0].value}`;
            
          case '综合':
            return `综合对比:
${args.LOCATION1}: ${current1.temp_C}℃ ${current1.weatherDesc[0].value}
${args.LOCATION2}: ${current2.temp_C}℃ ${current2.weatherDesc[0].value}`;
        }
      } catch (error) {
        return error.message;
      }
    }

    async getWeatherTrend(args) {
      try {
        const weatherData = await this.fetchWeatherData(args.LOCATION);
        const weather = weatherData.data.weather;
        
        let trend = `${args.LOCATION} 天气趋势:\n`;
        
        for (let i = 0; i < Math.min(3, weather.length); i++) {
          const day = weather[i];
          const dayName = i === 0 ? '今天' : i === 1 ? '明天' : '后天';
          const tempTrend = i > 0 ? 
            `(${parseInt(day.maxtempC) - parseInt(weather[i-1].maxtempC) > 0 ? '↑' : '↓'})` : '';
          
          trend += `${dayName}: ${day.maxtempC}℃${tempTrend} ${day.hourly[4].weatherDesc[0].value}\n`;
        }
        
        return trend;
      } catch (error) {
        return error.message;
      }
    }

    async calculateComfortIndex(args) {
      try {
        const weatherData = await this.fetchWeatherData(args.LOCATION);
        const current = weatherData.data.current_condition[0];
        
        const temp = parseInt(current.temp_C);
        const humidity = parseInt(current.humidity);
        const windSpeed = parseInt(current.windspeedKmph);
        
        // 简化的舒适度计算
        let comfortScore = 100;
        
        // 温度影响 (最适温度 20-25℃)
        if (temp < 10 || temp > 30) comfortScore -= 30;
        else if (temp < 15 || temp > 25) comfortScore -= 15;
        
        // 湿度影响 (最适湿度 40-60%)
        if (humidity < 30 || humidity > 80) comfortScore -= 20;
        else if (humidity < 40 || humidity > 60) comfortScore -= 10;
        
        // 风速影响
        if (windSpeed > 30) comfortScore -= 15;
        else if (windSpeed > 20) comfortScore -= 5;
        
        comfortScore = Math.max(0, Math.min(100, comfortScore));
        
        let level, emoji;
        if (comfortScore >= 80) { level = '非常舒适'; emoji = '😊'; }
        else if (comfortScore >= 60) { level = '舒适'; emoji = '🙂'; }
        else if (comfortScore >= 40) { level = '一般'; emoji = '😐'; }
        else { level = '不舒适'; emoji = '😞'; }
        
        return `${emoji} 舒适度: ${level} (${comfortScore}/100)`;
      } catch (error) {
        return '无法计算舒适度';
      }
    }

    // 实用建议功能
    async getTravelWeather(args) {
      try {
        const [originWeather, destWeather] = await Promise.all([
          this.fetchWeatherData(args.ORIGIN),
          this.fetchWeatherData(args.DESTINATION)
        ]);
        
        const originTemp = parseInt(originWeather.data.current_condition[0].temp_C);
        const destTemp = parseInt(destWeather.data.current_condition[0].temp_C);
        const destCondition = destWeather.data.current_condition[0].weatherDesc[0].value;
        
        const tempDiff = destTemp - originTemp;
        
        let advice = `从 ${args.ORIGIN} 到 ${args.DESTINATION} 的旅行建议:\n`;
        advice += `目的地天气: ${destCondition} ${destTemp}℃\n`;
        
        if (Math.abs(tempDiff) > 10) {
          advice += `💡 温度差异较大，请准备合适的衣物\n`;
        }
        
        if (destCondition.includes('雨')) {
          advice += `🌂 建议携带雨具\n`;
        }
        
        if (destTemp > 30) {
          advice += `🧴 注意防晒和补水\n`;
        } else if (destTemp < 5) {
          advice += `🧣 注意保暖\n`;
        }
        
        return advice;
      } catch (error) {
        return error.message;
      }
    }

    async getActivityRecommendation(args) {
      try {
        const weatherData = await this.fetchWeatherData(args.LOCATION);
        const current = weatherData.data.current_condition[0];
        
        const temp = parseInt(current.temp_C);
        const condition = current.weatherDesc[0].value;
        const windSpeed = parseInt(current.windspeedKmph);
        
        let recommendation = `${args.LOCATION} 的${args.ACTIVITY}建议: `;
        
        switch (args.ACTIVITY) {
          case '户外运动':
            if (condition.includes('晴') && temp >= 15 && temp <= 28 && windSpeed < 20) {
              recommendation += '✅ 非常适合户外运动';
            } else if (condition.includes('雨')) {
              recommendation += '❌ 不适合户外运动';
            } else {
              recommendation += '⚠️ 条件一般，请注意安全';
            }
            break;
            
          case '旅游观光':
            if (!condition.includes('雨') && temp >= 10 && temp <= 30) {
              recommendation += '✅ 适合旅游观光';
            } else {
              recommendation += '⚠️ 旅游条件一般';
            }
            break;
            
          case '摄影':
            if (condition.includes('晴') || condition.includes('云')) {
              recommendation += '✅ 光线条件良好，适合摄影';
            } else {
              recommendation += '⚠️ 摄影条件一般';
            }
            break;
            
          case '钓鱼':
            if (temp >= 15 && windSpeed < 15) {
              recommendation += '✅ 适合钓鱼';
            } else {
              recommendation += '⚠️ 钓鱼条件一般';
            }
            break;
            
          case '野餐':
            if (condition.includes('晴') && temp >= 18 && temp <= 28 && windSpeed < 15) {
              recommendation += '✅ 非常适合野餐';
            } else {
              recommendation += '⚠️ 野餐条件一般';
            }
            break;
            
          case '滑雪':
            if (temp < 0 && condition.includes('雪')) {
              recommendation += '✅ 非常适合滑雪';
            } else if (temp < 5) {
              recommendation += '⚠️ 滑雪条件一般';
            } else {
              recommendation += '❌ 不适合滑雪';
            }
            break;
        }
        
        return recommendation;
      } catch (error) {
        return error.message;
      }
    }

    async getClothingAdvice(args) {
      try {
        const weatherData = await this.fetchWeatherData(args.LOCATION);
        const current = weatherData.data.current_condition[0];
        
        const temp = parseInt(current.temp_C);
        const condition = current.weatherDesc[0].value;
        const windSpeed = parseInt(current.windspeedKmph);
        
        let clothing = `${args.LOCATION} 的穿衣建议:\n`;
        
        if (temp >= 28) {
          clothing += '👕 短袖、短裤\n';
          clothing += '🧴 注意防晒\n';
        } else if (temp >= 20) {
          clothing += '👔 长袖T恤、薄外套\n';
        } else if (temp >= 10) {
          clothing += '🧥 毛衣、夹克\n';
        } else if (temp >= 0) {
          clothing += '🧣 厚外套、围巾\n';
        } else {
          clothing += '🧤 羽绒服、手套、帽子\n';
        }
        
        if (condition.includes('雨')) {
          clothing += '🌂 携带雨具\n';
        }
        
        if (windSpeed > 20) {
          clothing += '💨 风大，注意防风\n';
        }
        
        return clothing;
      } catch (error) {
        return error.message;
      }
    }

    // 历史数据功能
    async getHistoricalWeather(args) {
      try {
        const days = Math.min(Math.max(0, args.DAYS), this.weatherHistory.length - 1);
        
        if (days >= this.weatherHistory.length) {
          return '历史数据不足';
        }
        
        const history = this.weatherHistory[days];
        const current = history.data.current_condition[0];
        
        const date = new Date(history.timestamp);
        const dateStr = date.toLocaleDateString('zh-CN');
        
        return `${args.LOCATION} ${days}天前 (${dateStr}): ${current.weatherDesc[0].value} ${current.temp_C}℃`;
      } catch (error) {
        return '无法获取历史天气';
      }
    }

    async getWeatherStatistics(args) {
      try {
        if (this.weatherHistory.length < 2) {
          return '历史数据不足，无法生成统计';
        }
        
        const recentHistory = this.weatherHistory.slice(0, 5); // 最近5次记录
        let totalTemp = 0;
        let maxTemp = -Infinity;
        let minTemp = Infinity;
        
        for (const record of recentHistory) {
          const temp = parseInt(record.data.current_condition[0].temp_C);
          totalTemp += temp;
          maxTemp = Math.max(maxTemp, temp);
          minTemp = Math.min(minTemp, temp);
        }
        
        const avgTemp = (totalTemp / recentHistory.length).toFixed(1);
        
        return `${args.LOCATION} 近期统计:
平均温度: ${avgTemp}℃
最高温度: ${maxTemp}℃
最低温度: ${minTemp}℃
数据样本: ${recentHistory.length}次`;
      } catch (error) {
        return '无法生成天气统计';
      }
    }

    async getExtremeWeather(args) {
      try {
        // 模拟极端天气记录
        const weatherData = await this.fetchWeatherData(args.LOCATION);
        const current = weatherData.data.current_condition[0];
        const temp = parseInt(current.temp_C);
        
        let extremes = `${args.LOCATION} 当前极端天气状况:\n`;
        
        if (temp >= 35) {
          extremes += '🔥 极端高温警告\n';
        }
        if (temp <= -15) {
          extremes += '❄️ 极端低温警告\n';
        }
        if (parseInt(current.windspeedKmph) >= 60) {
          extremes += '💨 极端大风警告\n';
        }
        if (parseFloat(current.precipMM) >= 100) {
          extremes += '🌧️ 极端暴雨警告\n';
        }
        
        if (extremes === `${args.LOCATION} 当前极端天气状况:\n`) {
          extremes += '✅ 无极端天气状况';
        }
        
        return extremes;
      } catch (error) {
        return '无法获取极端天气信息';
      }
    }

    // 系统功能
    setUserPreference(args) {
      switch (args.PREFERENCE) {
        case '温度单位':
          this.userPreferences.defaultUnit = args.VALUE;
          break;
        case '风速单位':
          this.userPreferences.defaultWindUnit = args.VALUE;
          break;
        case '语言':
          this.userPreferences.language = args.VALUE === '英文' ? '英文' : '中文';
          break;
      }
    }

    getSystemStatus() {
      const status = `🌤️ 天气系统状态:
📊 缓存数据: ${this.currentWeatherData ? '有' : '无'}
🕐 最后更新: ${this.getLastUpdateTime()}
⭐ 收藏地点: ${this.favoriteLocations.length}个
📈 历史记录: ${this.weatherHistory.length}条
⚙️ 温度单位: ${this.userPreferences.defaultUnit}
🌐 语言: ${this.userPreferences.language}`;
      
      return status;
    }

    // 工具方法
    async getWeatherEmoji(args) {
      try {
        const weatherData = await this.fetchWeatherData(args.LOCATION);
        const current = weatherData.data.current_condition[0];
        const weatherCode = parseInt(current.weatherCode);
        
        const emojiMap = {
          113: '☀️', 116: '⛅', 119: '☁️', 122: '☁️',
          143: '🌫️', 176: '🌦️', 179: '🌧️', 182: '🌧️',
          200: '⛈️', 227: '❄️', 230: '❄️', 248: '🌫️',
          260: '🌫️', 263: '🌦️', 266: '🌧️', 281: '🌧️',
          284: '🌧️', 293: '🌦️', 296: '🌧️', 299: '🌧️',
          302: '🌧️', 305: '🌧️', 308: '🌧️', 311: '🌧️',
          314: '🌧️', 317: '🌧️', 320: '🌧️', 323: '❄️',
          326: '❄️', 329: '❄️', 332: '❄️', 335: '❄️',
          338: '❄️', 350: '🌧️', 353: '🌦️', 356: '🌧️',
          359: '🌧️', 362: '🌧️', 365: '🌧️', 368: '❄️',
          371: '❄️', 374: '🌧️', 377: '🌧️', 386: '⛈️',
          389: '⛈️', 392: '⛈️', 395: '❄️'
        };
        
        return emojiMap[weatherCode] || '🌈';
      } catch (error) {
        return '❓';
      }
    }

    getLastUpdateTime() {
      if (!this.lastFetchTime) return '从未更新';
      
      const now = Date.now();
      const diff = Math.floor((now - this.lastFetchTime) / 1000);
      
      if (diff < 60) return `${diff}秒前`;
      if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
      return `${Math.floor(diff / 3600)}小时前`;
    }
  }

  Scratch.extensions.register(new WeatherExtension());
})(Scratch);

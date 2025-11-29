(function(_Scratch) {
    const { ArgumentType, BlockType, Cast, translate, extensions, runtime } = _Scratch;

    
    translate.setup({
        zh: {
            'extensionName': '抖音助手',
            'getVideoInfo': '获取抖音视频 [VIDEO_ID] 的 [INFO_TYPE]',
            'getVideoUrl': '获取抖音视频 [VIDEO_ID] 的完整网址',
            'searchVideos': '搜索关键词 [KEYWORD] 的抖音视频',
            'getAuthorInfo': '获取作者 [USER_ID] 的 [INFO_TYPE]',
            'getRelatedVideos': '获取与 [VIDEO_ID] 相关的视频',
            'videoTitle': '标题',
            'videoAuthor': '作者名',
            'videoPlayCount': '播放量',
            'videoLikeCount': '点赞数',
            'videoCommentCount': '评论数',
            'videoShareCount': '分享数',
            'videoCover': '封面URL',
            'videoPublishTime': '发布时间',
            'videoUrl': '视频网址',
            'userNickname': '昵称',
            'userAvatar': '头像URL',
            'userFansCount': '粉丝数',
            'userFollowingCount': '关注数',
            'userVideoCount': '作品数',
            'noData': '无数据',
            'invalidVideoId': '无效的视频ID',
            'invalidUserId': '无效的用户ID',
            'apiError': 'API请求错误',
            'networkError': '网络错误',
            'parseError': '数据解析错误'
        },
        en: {
            'extensionName': 'Douyin Assistant',
            'getVideoInfo': 'Get [INFO_TYPE] of video [VIDEO_ID]',
            'getVideoUrl': 'Get full URL of video [VIDEO_ID]',
            'searchVideos': 'Search videos by keyword [KEYWORD]',
            'getAuthorInfo': 'Get [INFO_TYPE] of user [USER_ID]',
            'getRelatedVideos': 'Get related videos of [VIDEO_ID]',
            'videoTitle': 'Title',
            'videoAuthor': 'Author',
            'videoPlayCount': 'Play count',
            'videoLikeCount': 'Like count',
            'videoCommentCount': 'Comment count',
            'videoShareCount': 'Share count',
            'videoCover': 'Cover URL',
            'videoPublishTime': 'Publish time',
            'videoUrl': 'Video URL',
            'userNickname': 'Nickname',
            'userAvatar': 'Avatar URL',
            'userFansCount': 'Fans count',
            'userFollowingCount': 'Following count',
            'userVideoCount': 'Video count',
            'noData': 'No data',
            'invalidVideoId': 'Invalid video ID',
            'invalidUserId': 'Invalid user ID',
            'apiError': 'API request error',
            'networkError': 'Network error',
            'parseError': 'Data parsing error'
        }
    });

    class DreamDouyin {
        constructor(runtime) {
            this._runtime = runtime;
            this.apiBase = 'https://www.douyin.com/aweme/v1'; // 抖音API基础地址
            this.proxy = 'https://cors-anywhere.herokuapp.com/'; // 跨域代理（建议自建）
            this.cache = new Map(); // 数据缓存
            this.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
            this.lastSearchResults = [];
        }

        getInfo() {
            return {
                id: 'DreamDouyin', // 扩展唯一ID
                name: translate('extensionName'),
                blockIconURI: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmMDAwMCIgZD0iTTEyIDJDMTAuODkgMiA5LjkgMi4zOSA5LjE3IDMuMTJDOC40NCAzLjg1IDggNC43NiA4IDUuNzNWMTRjMCAxLjQxIDEuMTEgMi41OSAyLjUyIDIuODcgMS4wMS4xOSAxLjg2Ljc0IDIuMzcgMS41NCAuNTItLjgwIDEuMzctMS4zOCAyLjM3LTEuNTQgMS40MS0uMjggMi41Mi0xLjQ2IDIuNTItMi44N1Y1LjczYzAtLjk3LS40NC0xLjg4LTEuMTctMi42MS0uNzMtLjczLTEuNzQtMS4xMi0yLjgzLTEuMTJ6bTcuMjkgMTRjMCAuODktLjcxIDEuNjEtMS42MSAxLjYxSDYuMzJjLS45IDAtMS42MS0uNzItMS42MS0xLjYxIDAtLjkgLjcxLTEuNjEgMS42MS0xLjYxSDIyYzEuMTAgMCAxLjkxLjkxIDEuOTEgMS42MnptLTcuMjktMTVjMC0uODYtLjcwLTEuNTYtMS41Ni0xLjU2aC0yLjY1Yy0uODYgMC0xLjU2LjcwLTEuNTYuNTZzLjcwIDEuNTYgMS41NiAxLjU2aDIuNjVjLjg2IDAgMS41Ni0uNzAgMS41Ni0xLjU2cy0uNzAtMS41Ni0xLjU2LTEuNTZ6Ii8+PC9zdmc+',
                blockIconUnicode: '🎵',
                blockIconColor: '#FE2C55', // 抖音红色主色调
                blockIconSecondaryColor: '#D91A3F',
                blocks: [
                    // 获取视频信息
                    {
                        opcode: 'getVideoInfo',
                        blockType: BlockType.REPORTER,
                        text: translate('getVideoInfo'),
                        arguments: {
                            VIDEO_ID: {
                                type: ArgumentType.STRING,
                                defaultValue: '7123456789012345678' // 示例视频ID
                            },
                            INFO_TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'videoInfoTypes'
                            }
                        }
                    },
                    // 获取视频网址
                    {
                        opcode: 'getVideoUrl',
                        blockType: BlockType.REPORTER,
                        text: translate('getVideoUrl'),
                        arguments: {
                            VIDEO_ID: {
                                type: ArgumentType.STRING,
                                defaultValue: '7123456789012345678'
                            }
                        }
                    },
                    // 搜索视频
                    {
                        opcode: 'searchVideos',
                        blockType: BlockType.REPORTER,
                        text: '搜索关键词 [KEYWORD] 的抖音视频',
                        arguments: {
                            KEYWORD: {
                                type: ArgumentType.STRING,
                                defaultValue: '星河为梦'
                            }
                        }
                    },
                    // 获取相关视频
                    {
                        opcode: 'getRelatedVideos',
                        blockType: BlockType.REPORTER,
                        text: '获取与视频 [VIDEO_ID] 相关的视频',
                        arguments: {
                            VIDEO_ID: {
                                type: ArgumentType.STRING,
                                defaultValue: '7123456789012345678'
                            }
                        }
                    },
                    // 获取作者信息
                    {
                        opcode: 'getAuthorInfo',
                        blockType: BlockType.REPORTER,
                        text: translate('getAuthorInfo'),
                        arguments: {
                            USER_ID: {
                                type: ArgumentType.STRING,
                                defaultValue: '12345678' // 示例用户ID
                            },
                            INFO_TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'userInfoTypes'
                            }
                        }
                    },
                    // 视频列表处理
                    {
                        opcode: 'videoListLength',
                        blockType: BlockType.REPORTER,
                        text: '视频列表 [LIST] 的长度',
                        arguments: {
                            LIST: {
                                type: ArgumentType.STRING,
                                defaultValue: '[]'
                            }
                        }
                    },
                    {
                        opcode: 'getVideoFromList',
                        blockType: BlockType.REPORTER,
                        text: '视频列表 [LIST] 的第 [INDEX] 个视频',
                        arguments: {
                            LIST: {
                                type: ArgumentType.STRING,
                                defaultValue: '[]'
                            },
                            INDEX: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'getVideoProperty',
                        blockType: BlockType.REPORTER,
                        text: '视频 [VIDEO] 的 [PROPERTY]',
                        arguments: {
                            VIDEO: {
                                type: ArgumentType.STRING,
                                defaultValue: '{}'
                            },
                            PROPERTY: {
                                type: ArgumentType.STRING,
                                menu: 'videoProperties'
                            }
                        }
                    },
                    // 搜索对话框
                    {
                        opcode: 'showSearchDialog',
                        blockType: BlockType.COMMAND,
                        text: '显示抖音视频搜索对话框'
                    },
                    {
                        opcode: 'getLastSearch',
                        blockType: BlockType.REPORTER,
                        text: '最近一次搜索的结果'
                    }
                ],
                menus: {
                    videoInfoTypes: [
                        { text: translate('videoTitle'), value: 'title' },
                        { text: translate('videoAuthor'), value: 'author' },
                        { text: translate('videoPlayCount'), value: 'playCount' },
                        { text: translate('videoLikeCount'), value: 'likeCount' },
                        { text: translate('videoCommentCount'), value: 'commentCount' },
                        { text: translate('videoShareCount'), value: 'shareCount' },
                        { text: translate('videoCover'), value: 'cover' },
                        { text: translate('videoPublishTime'), value: 'publishTime' },
                        { text: translate('videoUrl'), value: 'url' }
                    ],
                    userInfoTypes: [
                        { text: translate('userNickname'), value: 'nickname' },
                        { text: translate('userAvatar'), value: 'avatar' },
                        { text: translate('userFansCount'), value: 'fansCount' },
                        { text: translate('userFollowingCount'), value: 'followingCount' },
                        { text: translate('userVideoCount'), value: 'videoCount' }
                    ],
                    videoProperties: [
                        { text: translate('videoTitle'), value: 'title' },
                        { text: '视频ID', value: 'videoId' },
                        { text: translate('videoAuthor'), value: 'author' },
                        { text: translate('videoPlayCount'), value: 'playCount' },
                        { text: translate('videoLikeCount'), value: 'likeCount' },
                        { text: translate('videoCover'), value: 'cover' },
                        { text: translate('videoUrl'), value: 'url' }
                    ]
                }
            };
        }

        // 获取视频信息
        async getVideoInfo(args) {
            const videoId = Cast.toString(args.VIDEO_ID).trim();
            const infoType = Cast.toString(args.INFO_TYPE);

            if (!videoId || isNaN(videoId)) {
                return translate('invalidVideoId');
            }

            try {
                const cacheKey = `video:${videoId}`;
                let data;

                if (this.cache.has(cacheKey)) {
                    data = this.cache.get(cacheKey);
                } else {
                    data = await this._fetchVideoInfo(videoId);
                    this.cache.set(cacheKey, data);
                }

                switch (infoType) {
                    case 'title': return data.title || translate('noData');
                    case 'author': return data.authorName || translate('noData');
                    case 'playCount': return this._formatNumber(data.playCount) || 0;
                    case 'likeCount': return this._formatNumber(data.likeCount) || 0;
                    case 'commentCount': return this._formatNumber(data.commentCount) || 0;
                    case 'shareCount': return this._formatNumber(data.shareCount) || 0;
                    case 'cover': return data.coverUrl || translate('noData');
                    case 'publishTime': return this._formatDate(data.publishTime) || translate('noData');
                    case 'url': return `https://www.douyin.com/video/${videoId}`;
                    default: return translate('noData');
                }
            } catch (e) {
                return translate('apiError') + ': ' + e.message;
            }
        }

        // 获取视频网址
        getVideoUrl(args) {
            const videoId = Cast.toString(args.VIDEO_ID).trim();
            if (!videoId || isNaN(videoId)) {
                return translate('invalidVideoId');
            }
            return `https://www.douyin.com/video/${videoId}`;
        }

        // 搜索视频
        async searchVideos(args) {
            const keyword = Cast.toString(args.KEYWORD).trim();
            if (!keyword) return '[]';

            try {
                const cacheKey = `search:${keyword}`;
                let data;

                if (this.cache.has(cacheKey)) {
                    data = this.cache.get(cacheKey);
                } else {
                    data = await this._fetchSearchResults(keyword);
                    this.cache.set(cacheKey, data);
                }

                const videos = data.map(item => ({
                    videoId: item.videoId,
                    title: item.title,
                    author: item.authorName,
                    playCount: this._formatNumber(item.playCount),
                    likeCount: this._formatNumber(item.likeCount),
                    coverUrl: item.coverUrl,
                    url: `https://www.douyin.com/video/${item.videoId}`
                }));

                this.lastSearchResults = videos;
                return JSON.stringify(videos);
            } catch (e) {
                return '[]';
            }
        }

        // 获取相关视频
        async getRelatedVideos(args) {
            const videoId = Cast.toString(args.VIDEO_ID).trim();
            if (!videoId || isNaN(videoId)) return '[]';

            try {
                const cacheKey = `related:${videoId}`;
                let data;

                if (this.cache.has(cacheKey)) {
                    data = this.cache.get(cacheKey);
                } else {
                    data = await this._fetchRelatedVideos(videoId);
                    this.cache.set(cacheKey, data);
                }

                const videos = data.map(item => ({
                    videoId: item.videoId,
                    title: item.title,
                    author: item.authorName,
                    coverUrl: item.coverUrl,
                    url: `https://www.douyin.com/video/${item.videoId}`
                }));

                return JSON.stringify(videos);
            } catch (e) {
                return '[]';
            }
        }

        // 获取作者信息
        async getAuthorInfo(args) {
            const userId = Cast.toString(args.USER_ID).trim();
            if (!userId || isNaN(userId)) {
                return translate('invalidUserId');
            }

            try {
                const cacheKey = `user:${userId}`;
                let data;

                if (this.cache.has(cacheKey)) {
                    data = this.cache.get(cacheKey);
                } else {
                    data = await this._fetchUserInfo(userId);
                    this.cache.set(cacheKey, data);
                }

                switch (Cast.toString(args.INFO_TYPE)) {
                    case 'nickname': return data.nickname || translate('noData');
                    case 'avatar': return data.avatarUrl || translate('noData');
                    case 'fansCount': return this._formatNumber(data.fansCount) || 0;
                    case 'followingCount': return this._formatNumber(data.followingCount) || 0;
                    case 'videoCount': return this._formatNumber(data.videoCount) || 0;
                    default: return translate('noData');
                }
            } catch (e) {
                return translate('apiError') + ': ' + e.message;
            }
        }

        // 视频列表长度
        videoListLength(args) {
            try {
                const list = JSON.parse(Cast.toString(args.LIST));
                return list.length;
            } catch (e) {
                return 0;
            }
        }

        // 从列表获取视频
        getVideoFromList(args) {
            try {
                const list = JSON.parse(Cast.toString(args.LIST));
                const index = Cast.toNumber(args.INDEX) - 1;
                if (index < 0 || index >= list.length) return '{}';
                return JSON.stringify(list[index]);
            } catch (e) {
                return '{}';
            }
        }

        // 获取视频属性
        getVideoProperty(args) {
            try {
                const video = JSON.parse(Cast.toString(args.VIDEO));
                return video[Cast.toString(args.PROPERTY)] || translate('noData');
            } catch (e) {
                return translate('noData');
            }
        }

        // 显示搜索对话框
        showSearchDialog() {
            const keyword = prompt('请输入搜索关键词（如：舞蹈教程）：');
            if (keyword) this.searchVideos({ KEYWORD: keyword });
        }

        // 获取最近搜索结果
        getLastSearch() {
            return JSON.stringify(this.lastSearchResults || []);
        }

        // 工具方法：格式化数字（10000 → 1万）
        _formatNumber(num) {
            if (!num) return 0;
            if (num >= 10000) return (num / 10000).toFixed(1) + '万';
            return num.toString();
        }

        // 格式化日期
        _formatDate(timestamp) {
            if (!timestamp) return '';
            const date = new Date(timestamp * 1000);
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        }

        // 发送请求（带代理解决跨域）
        async _sendRequest(url) {
            try {
                const proxyUrl = this.proxy + url;
                const response = await fetch(proxyUrl, {
                    headers: {
                        'User-Agent': this.userAgent,
                        'Referer': 'https://www.douyin.com',
                        'Cookie': 'odin_tt=xxx; passport_csrf_token=xxx' // 实际使用需替换为有效Cookie
                    }
                });

                if (!response.ok) throw new Error(`${response.status}`);
                return await response.json();
            } catch (e) {
                throw new Error(translate('networkError') + ': ' + e.message);
            }
        }

        // 获取视频信息（模拟API，实际需对接抖音开放平台）
        async _fetchVideoInfo(videoId) {
            // 注意：抖音官方API需认证，此处为模拟数据结构
            return {
                videoId,
                title: '示例抖音视频标题',
                authorName: '示例作者',
                playCount: 1250000,
                likeCount: 86000,
                commentCount: 3200,
                shareCount: 5600,
                coverUrl: 'https://picsum.photos/300/200?random=1',
                publishTime: 1680000000
            };
        }

        // 搜索视频（模拟API）
        async _fetchSearchResults(keyword) {
            // 实际使用需通过抖音开放平台获取合法接口
            return Array(5).fill().map((_, i) => ({
                videoId: `71${Math.floor(Math.random() * 1000000000000000)}`,
                title: `${keyword} 相关视频 ${i + 1}`,
                authorName: `创作者${i + 1}`,
                playCount: Math.floor(Math.random() * 1000000),
                likeCount: Math.floor(Math.random() * 100000),
                coverUrl: `https://picsum.photos/300/200?random=${i + 2}`
            }));
        }

        // 获取相关视频（模拟API）
        async _fetchRelatedVideos(videoId) {
            return Array(3).fill().map((_, i) => ({
                videoId: `71${Math.floor(Math.random() * 1000000000000000)}`,
                title: `与视频${videoId}相关的视频 ${i + 1}`,
                authorName: `推荐作者${i + 1}`,
                coverUrl: `https://picsum.photos/300/200?random=${i + 10}`
            }));
        }

        // 获取用户信息（模拟API）
        async _fetchUserInfo(userId) {
            return {
                userId,
                nickname: '示例抖音用户',
                avatarUrl: 'https://picsum.photos/100/100?random=user',
                fansCount: 156000,
                followingCount: 230,
                videoCount: 45
            };
        }
    }

    extensions.register(new DreamDouyin(runtime));
}(Scratch));
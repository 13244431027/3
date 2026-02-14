class NeteaseMusicExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this._lastSearchResult = null;
    this._lastPlaylistResult = null;
    this._lastUserInfo = null;
    this._baseUrl = "https://163api.qijieya.cn";
  }

  getInfo() {
    return {
      id: 'neteaseMusicbysystem',
      name: '网易云音乐1.0 by system',
      color1: '#E60026',
      color2: '#C41230',
      blocks: [
        // 搜索相关
        {
          opcode: 'searchSongs',
          blockType: 'reporter',
          text: '搜索歌曲 [QUERY]',
          arguments: {
            QUERY: {
              type: 'string',
              defaultValue: '周杰伦'
            }
          }
        },
        {
          opcode: 'getFirstSongId',
          blockType: 'reporter',
          text: '获取第一首歌曲ID'
        },
        {
          opcode: 'getFirstSongName',
          blockType: 'reporter',
          text: '获取第一首歌曲名称'
        },
        {
          opcode: 'getFirstArtistName',
          blockType: 'reporter',
          text: '获取第一首歌曲艺术家'
        },
        {
          opcode: 'getSongCount',
          blockType: 'reporter',
          text: '获取歌曲总数'
        },
        
        // 歌曲播放相关
        {
          opcode: 'getSongUrlById',
          blockType: 'reporter',
          text: '获取歌曲播放链接 [SONG_ID]',
          arguments: {
            SONG_ID: {
              type: 'string',
              defaultValue: ''
            }
          }
        },
        {
          opcode: 'getFirstSongUrl',
          blockType: 'reporter',
          text: '获取第一首歌曲播放链接'
        },
        {
          opcode: 'getSongDetail',
          blockType: 'reporter',
          text: '获取歌曲详情 [SONG_ID]',
          arguments: {
            SONG_ID: {
              type: 'string',
              defaultValue: ''
            }
          }
        },
        {
          opcode: 'getLyric',
          blockType: 'reporter',
          text: '获取歌词 [SONG_ID]',
          arguments: {
            SONG_ID: {
              type: 'string',
              defaultValue: ''
            }
          }
        },
        
        // 歌单相关
        {
          opcode: 'getPlaylistDetail',
          blockType: 'reporter',
          text: '获取歌单详情 [PLAYLIST_ID]',
          arguments: {
            PLAYLIST_ID: {
              type: 'string',
              defaultValue: ''
            }
          }
        },
        {
          opcode: 'getPlaylistSongs',
          blockType: 'reporter',
          text: '获取歌单所有歌曲 [PLAYLIST_ID]',
          arguments: {
            PLAYLIST_ID: {
              type: 'string',
              defaultValue: ''
            }
          }
        },
        
        // 用户相关
        {
          opcode: 'getUserDetail',
          blockType: 'reporter',
          text: '获取用户详情 [USER_ID]',
          arguments: {
            USER_ID: {
              type: 'string',
              defaultValue: ''
            }
          }
        },
        {
          opcode: 'getUserPlaylists',
          blockType: 'reporter',
          text: '获取用户歌单 [USER_ID]',
          arguments: {
            USER_ID: {
              type: 'string',
              defaultValue: ''
            }
          }
        },
        
        // 排行榜
        {
          opcode: 'getTopList',
          blockType: 'reporter',
          text: '获取排行榜'
        },
        {
          opcode: 'getTopListDetail',
          blockType: 'reporter',
          text: '获取排行榜详情 [LIST_ID]',
          arguments: {
            LIST_ID: {
              type: 'string',
              defaultValue: '19723756'
            }
          }
        },
        
        // 推荐
        {
          opcode: 'getRecommendSongs',
          blockType: 'reporter',
          text: '获取每日推荐歌曲'
        },
        {
          opcode: 'getRecommendPlaylists',
          blockType: 'reporter',
          text: '获取每日推荐歌单'
        },
        
        // MV相关
        {
          opcode: 'getMvDetail',
          blockType: 'reporter',
          text: '获取MV详情 [MV_ID]',
          arguments: {
            MV_ID: {
              type: 'string',
              defaultValue: ''
            }
          }
        },
        {
          opcode: 'getMvUrl',
          blockType: 'reporter',
          text: '获取MV播放链接 [MV_ID]',
          arguments: {
            MV_ID: {
              type: 'string',
              defaultValue: ''
            }
          }
        }
      ],
      menus: {}
    };
  }

  // 搜索歌曲
  async searchSongs(args) {
    const query = args.QUERY;
    try {
      const response = await fetch(`${this._baseUrl}/search?keywords=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this._lastSearchResult = await response.json();
      return JSON.stringify(this._lastSearchResult);
    } catch (error) {
      console.error('搜索音乐失败:', error);
      return '';
    }
  }

  getFirstSongId() {
    if (!this._lastSearchResult || !this._lastSearchResult.result || !this._lastSearchResult.result.songs || this._lastSearchResult.result.songs.length === 0) {
      return '';
    }
    return this._lastSearchResult.result.songs[0].id;
  }

  getFirstSongName() {
    if (!this._lastSearchResult || !this._lastSearchResult.result || !this._lastSearchResult.result.songs || this._lastSearchResult.result.songs.length === 0) {
      return '';
    }
    return this._lastSearchResult.result.songs[0].name;
  }

  getFirstArtistName() {
    if (!this._lastSearchResult || !this._lastSearchResult.result || !this._lastSearchResult.result.songs || this._lastSearchResult.result.songs.length === 0) {
      return '';
    }
    return this._lastSearchResult.result.songs[0].artists.map(artist => artist.name).join(', ');
  }

  getSongCount() {
    if (!this._lastSearchResult || !this._lastSearchResult.result || !this._lastSearchResult.result.songs) {
      return 0;
    }
    return this._lastSearchResult.result.songs.length;
  }

  // 获取歌曲播放链接
  async getSongUrlById(args) {
    const songId = args.SONG_ID;
    if (!songId) return '';
    
    try {
      const response = await fetch(`${this._baseUrl}/song/url?id=${songId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.code === 200 && data.data && data.data.length > 0 && data.data[0].url) {
        return data.data[0].url;
      }
      return '';
    } catch (error) {
      console.error('获取歌曲链接失败:', error);
      return '';
    }
  }

  async getFirstSongUrl() {
    const firstSongId = this.getFirstSongId();
    if (!firstSongId) return '';
    
    return await this.getSongUrlById({ SONG_ID: firstSongId });
  }

  // 获取歌曲详情
  async getSongDetail(args) {
    const songId = args.SONG_ID;
    if (!songId) return '';
    
    try {
      const response = await fetch(`${this._baseUrl}/song/detail?ids=${songId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return JSON.stringify(data);
    } catch (error) {
      console.error('获取歌曲详情失败:', error);
      return '';
    }
  }

  // 获取歌词
  async getLyric(args) {
    const songId = args.SONG_ID;
    if (!songId) return '';
    
    try {
      const response = await fetch(`${this._baseUrl}/lyric?id=${songId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return JSON.stringify(data);
    } catch (error) {
      console.error('获取歌词失败:', error);
      return '';
    }
  }

  // 获取歌单详情
  async getPlaylistDetail(args) {
    const playlistId = args.PLAYLIST_ID;
    if (!playlistId) return '';
    
    try {
      const response = await fetch(`${this._baseUrl}/playlist/detail?id=${playlistId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this._lastPlaylistResult = await response.json();
      return JSON.stringify(this._lastPlaylistResult);
    } catch (error) {
      console.error('获取歌单详情失败:', error);
      return '';
    }
  }

  // 获取歌单所有歌曲
  async getPlaylistSongs(args) {
    const playlistId = args.PLAYLIST_ID;
    if (!playlistId) return '';
    
    try {
      const response = await fetch(`${this._baseUrl}/playlist/track/all?id=${playlistId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return JSON.stringify(data);
    } catch (error) {
      console.error('获取歌单所有歌曲失败:', error);
      return '';
    }
  }

  // 获取用户详情
  async getUserDetail(args) {
    const userId = args.USER_ID;
    if (!userId) return '';
    
    try {
      const response = await fetch(`${this._baseUrl}/user/detail?uid=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this._lastUserInfo = await response.json();
      return JSON.stringify(this._lastUserInfo);
    } catch (error) {
      console.error('获取用户详情失败:', error);
      return '';
    }
  }

  // 获取用户歌单
  async getUserPlaylists(args) {
    const userId = args.USER_ID;
    if (!userId) return '';
    
    try {
      const response = await fetch(`${this._baseUrl}/user/playlist?uid=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return JSON.stringify(data);
    } catch (error) {
      console.error('获取用户歌单失败:', error);
      return '';
    }
  }

  // 获取排行榜
  async getTopList() {
    try {
      const response = await fetch(`${this._baseUrl}/toplist`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return JSON.stringify(data);
    } catch (error) {
      console.error('获取排行榜失败:', error);
      return '';
    }
  }

  // 获取排行榜详情
  async getTopListDetail(args) {
    const listId = args.LIST_ID;
    if (!listId) return '';
    
    try {
      const response = await fetch(`${this._baseUrl}/top/list?id=${listId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return JSON.stringify(data);
    } catch (error) {
      console.error('获取排行榜详情失败:', error);
      return '';
    }
  }

  // 获取每日推荐歌曲
  async getRecommendSongs() {
    try {
      const response = await fetch(`${this._baseUrl}/recommend/songs`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return JSON.stringify(data);
    } catch (error) {
      console.error('获取每日推荐歌曲失败:', error);
      return '';
    }
  }

  // 获取每日推荐歌单
  async getRecommendPlaylists() {
    try {
      const response = await fetch(`${this._baseUrl}/recommend/resource`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return JSON.stringify(data);
    } catch (error) {
      console.error('获取每日推荐歌单失败:', error);
      return '';
    }
  }

  // 获取MV详情
  async getMvDetail(args) {
    const mvId = args.MV_ID;
    if (!mvId) return '';
    
    try {
      const response = await fetch(`${this._baseUrl}/mv/detail?mvid=${mvId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return JSON.stringify(data);
    } catch (error) {
      console.error('获取MV详情失败:', error);
      return '';
    }
  }

  // 获取MV播放链接
  async getMvUrl(args) {
    const mvId = args.MV_ID;
    if (!mvId) return '';
    
    try {
      const response = await fetch(`${this._baseUrl}/mv/url?id=${mvId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return JSON.stringify(data);
    } catch (error) {
      console.error('获取MV播放链接失败:', error);
      return '';
    }
  }
}

Scratch.extensions.register(new NeteaseMusicExtension());
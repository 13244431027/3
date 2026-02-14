class EdgeTTS {
  constructor(runtime) {
    this.runtime = runtime; // Scratch 运行时环境，用于存储和目标
    this.currentAudioBlob = null; // 最新的 TTS 音频 blob
    this.currentAudioUrl = null;  // 用于播放的 URL

    this.voices = [
      { name: "af-ZA-AdriNeural", label: "Microsoft Adri 在线 (自然) - 南非荷兰语 (南非)" },
      { name: "af-ZA-WillemNeural", label: "Microsoft Willem 在线 (自然) - 南非荷兰语 (南非)" },
      { name: "sq-AL-AnilaNeural", label: "Microsoft Anila 在线 (自然) - 阿尔巴尼亚语 (阿尔巴尼亚)" },
      { name: "sq-AL-IlirNeural", label: "Microsoft Ilir 在线 (自然) - 阿尔巴尼亚语 (阿尔巴尼亚)" },
      { name: "am-ET-AmehaNeural", label: "Microsoft Ameha 在线 (自然) - 阿姆哈拉语 (埃塞俄比亚)" },
      { name: "am-ET-MekdesNeural", label: "Microsoft Mekdes 在线 (自然) - 阿姆哈拉语 (埃塞俄比亚)" },
      { name: "ar-DZ-AminaNeural", label: "Microsoft Amina 在线 (自然) - 阿拉伯语 (阿尔及利亚)" },
      { name: "ar-DZ-IsmaelNeural", label: "Microsoft Ismael 在线 (自然) - 阿拉伯语 (阿尔及利亚)" },
      { name: "ar-BH-AliNeural", label: "Microsoft Ali 在线 (自然) - 阿拉伯语 (巴林)" },
      { name: "ar-BH-LailaNeural", label: "Microsoft Laila 在线 (自然) - 阿拉伯语 (巴林)" },
      { name: "ar-EG-SalmaNeural", label: "Microsoft Salma 在线 (自然) - 阿拉伯语 (埃及)" },
      { name: "ar-EG-ShakirNeural", label: "Microsoft Shakir 在线 (自然) - 阿拉伯语 (埃及)" },
      { name: "ar-IQ-BasselNeural", label: "Microsoft Bassel 在线 (自然) - 阿拉伯语 (伊拉克)" },
      { name: "ar-IQ-RanaNeural", label: "Microsoft Rana 在线 (自然) - 阿拉伯语 (伊拉克)" },
      { name: "ar-JO-SanaNeural", label: "Microsoft Sana 在线 (自然) - 阿拉伯语 (约旦)" },
      { name: "ar-JO-TaimNeural", label: "Microsoft Taim 在线 (自然) - 阿拉伯语 (约旦)" },
      { name: "ar-KW-FahedNeural", label: "Microsoft Fahed 在线 (自然) - 阿拉伯语 (科威特)" },
      { name: "ar-KW-NouraNeural", label: "Microsoft Noura 在线 (自然) - 阿拉伯语 (科威特)" },
      { name: "ar-LB-LaylaNeural", label: "Microsoft Layla 在线 (自然) - 阿拉伯语 (黎巴嫩)" },
      { name: "ar-LB-RamiNeural", label: "Microsoft Rami 在线 (自然) - 阿拉伯语 (黎巴嫩)" },
      { name: "ar-LY-ImanNeural", label: "Microsoft Iman 在线 (自然) - 阿拉伯语 (利比亚)" },
      { name: "ar-LY-OmarNeural", label: "Microsoft Omar 在线 (自然) - 阿拉伯语 (利比亚)" },
      { name: "ar-MA-JamalNeural", label: "Microsoft Jamal 在线 (自然) - 阿拉伯语 (摩洛哥)" },
      { name: "ar-MA-MounaNeural", label: "Microsoft Mouna 在线 (自然) - 阿拉伯语 (摩洛哥)" },
      { name: "ar-OM-AbdullahNeural", label: "Microsoft Abdullah 在线 (自然) - 阿拉伯语 (阿曼)" },
      { name: "ar-OM-AyshaNeural", label: "Microsoft Aysha 在线 (自然) - 阿拉伯语 (阿曼)" },
      { name: "ar-QA-AmalNeural", label: "Microsoft Amal 在线 (自然) - 阿拉伯语 (卡塔尔)" },
      { name: "ar-QA-MoazNeural", label: "Microsoft Moaz 在线 (自然) - 阿拉伯语 (卡塔尔)" },
      { name: "ar-SA-HamedNeural", label: "Microsoft Hamed 在线 (自然) - 阿拉伯语 (沙特阿拉伯)" },
      { name: "ar-SA-ZariyahNeural", label: "Microsoft Zariyah 在线 (自然) - 阿拉伯语 (沙特阿拉伯)" },
      { name: "ar-SY-AmanyNeural", label: "Microsoft Amany 在线 (自然) - 阿拉伯语 (叙利亚)" },
      { name: "ar-SY-LaithNeural", label: "Microsoft Laith 在线 (自然) - 阿拉伯语 (叙利亚)" },
      { name: "ar-TN-HediNeural", label: "Microsoft Hedi 在线 (自然) - 阿拉伯语 (突尼斯)" },
      { name: "ar-TN-ReemNeural", label: "Microsoft Reem 在线 (自然) - 阿拉伯语 (突尼斯)" },
      { name: "ar-AE-FatimaNeural", label: "Microsoft Fatima 在线 (自然) - 阿拉伯语 (阿拉伯联合酋长国)" },
      { name: "ar-AE-HamdanNeural", label: "Microsoft Hamdan 在线 (自然) - 阿拉伯语 (阿拉伯联合酋长国)" },
      { name: "ar-YE-MaryamNeural", label: "Microsoft Maryam 在线 (自然) - 阿拉伯语 (也门)" },
      { name: "ar-YE-SalehNeural", label: "Microsoft Saleh 在线 (自然) - 阿拉伯语 (也门)" },
      { name: "az-AZ-BabekNeural", label: "Microsoft Babek 在线 (自然) - 阿塞拜疆语 (阿塞拜疆)" },
      { name: "az-AZ-BanuNeural", label: "Microsoft Banu 在线 (自然) - 阿塞拜疆语 (阿塞拜疆)" },
      { name: "bn-BD-NabanitaNeural", label: "Microsoft Nabanita 在线 (自然) - 孟加拉语 (孟加拉国)" },
      { name: "bn-BD-PradeepNeural", label: "Microsoft Pradeep 在线 (自然) - 孟加拉语 (孟加拉国)" },
      { name: "bn-IN-BashkarNeural", label: "Microsoft Bashkar 在线 (自然) - 孟加拉语 (印度)" },
      { name: "bn-IN-TanishaaNeural", label: "Microsoft Tanishaa 在线 (自然) - 孟加拉语 (印度)" },
      { name: "bs-BA-VesnaNeural", label: "Microsoft Vesna 在线 (自然) - 波斯尼亚语 (波斯尼亚和黑塞哥维那)" },
      { name: "bs-BA-GoranNeural", label: "Microsoft Goran 在线 (自然) - 波斯尼亚语 (波斯尼亚)" },
      { name: "bg-BG-BorislavNeural", label: "Microsoft Borislav 在线 (自然) - 保加利亚语 (保加利亚)" },
      { name: "bg-BG-KalinaNeural", label: "Microsoft Kalina 在线 (自然) - 保加利亚语 (保加利亚)" },
      { name: "my-MM-NilarNeural", label: "Microsoft Nilar 在线 (自然) - 缅甸语 (缅甸)" },
      { name: "my-MM-ThihaNeural", label: "Microsoft Thiha 在线 (自然) - 缅甸语 (缅甸)" },
      { name: "ca-ES-EnricNeural", label: "Microsoft Enric 在线 (自然) - 加泰罗尼亚语" },
      { name: "ca-ES-JoanaNeural", label: "Microsoft Joana 在线 (自然) - 加泰罗尼亚语" },
      { name: "zh-HK-HiuGaaiNeural", label: "Microsoft HiuGaai 在线 (自然) - 中文 (粤语繁体)" },
      { name: "zh-HK-HiuMaanNeural", label: "Microsoft HiuMaan 在线 (自然) - 中文 (香港特别行政区)" },
      { name: "zh-HK-WanLungNeural", label: "Microsoft WanLung 在线 (自然) - 中文 (香港特别行政区)" },
      { name: "zh-CN-XiaoxiaoNeural", label: "Microsoft 晓晓 在线 (自然) - 中文 (中国大陆)" },
      { name: "zh-CN-XiaoyiNeural", label: "Microsoft 晓伊 在线 (自然) - 中文 (中国大陆)" },
      { name: "zh-CN-YunjianNeural", label: "Microsoft 云健 在线 (自然) - 中文 (中国大陆)" },
      { name: "zh-CN-YunxiNeural", label: "Microsoft 云希 在线 (自然) - 中文 (中国大陆)" },
      { name: "zh-CN-YunxiaNeural", label: "Microsoft 云夏 在线 (自然) - 中文 (中国大陆)" },
      { name: "zh-CN-YunyangNeural", label: "Microsoft 云扬 在线 (自然) - 中文 (中国大陆)" },
      { name: "zh-CN-liaoning-XiaobeiNeural", label: "Microsoft 晓北 在线 (自然) - 中文 (东北官话)" },
      { name: "zh-TW-HsiaoChenNeural", label: "Microsoft 晓臻 在线 (自然) - 中文 (台湾)" },
      { name: "zh-TW-YunJheNeural", label: "Microsoft 云哲 在线 (自然) - 中文 (台湾)" },
      { name: "zh-TW-HsiaoYuNeural", label: "Microsoft 晓雨 在线 (自然) - 中文 (台湾普通话)" },
      { name: "zh-CN-shaanxi-XiaoniNeural", label: "Microsoft 晓妮 在线 (自然) - 中文 (中原官话陕西)" },
      { name: "hr-HR-GabrijelaNeural", label: "Microsoft Gabrijela 在线 (自然) - 克罗地亚语 (克罗地亚)" },
      { name: "hr-HR-SreckoNeural", label: "Microsoft Srecko 在线 (自然) - 克罗地亚语 (克罗地亚)" },
      { name: "cs-CZ-AntoninNeural", label: "Microsoft Antonin 在线 (自然) - 捷克语 (捷克)" },
      { name: "cs-CZ-VlastaNeural", label: "Microsoft Vlasta 在线 (自然) - 捷克语 (捷克)" },
      { name: "da-DK-ChristelNeural", label: "Microsoft Christel 在线 (自然) - 丹麦语 (丹麦)" },
      { name: "da-DK-JeppeNeural", label: "Microsoft Jeppe 在线 (自然) - 丹麦语 (丹麦)" },
      { name: "nl-BE-ArnaudNeural", label: "Microsoft Arnaud 在线 (自然) - 荷兰语 (比利时)" },
      { name: "nl-BE-DenaNeural", label: "Microsoft Dena 在线 (自然) - 荷兰语 (比利时)" },
      { name: "nl-NL-ColetteNeural", label: "Microsoft Colette 在线 (自然) - 荷兰语 (荷兰)" },
      { name: "nl-NL-FennaNeural", label: "Microsoft Fenna 在线 (自然) - 荷兰语 (荷兰)" },
      { name: "nl-NL-MaartenNeural", label: "Microsoft Maarten 在线 (自然) - 荷兰语 (荷兰)" },
      { name: "en-AU-NatashaNeural", label: "Microsoft Natasha 在线 (自然) - 英语 (澳大利亚)" },
      { name: "en-AU-WilliamNeural", label: "Microsoft William 在线 (自然) - 英语 (澳大利亚)" },
      { name: "en-CA-ClaraNeural", label: "Microsoft Clara 在线 (自然) - 英语 (加拿大)" },
      { name: "en-CA-LiamNeural", label: "Microsoft Liam 在线 (自然) - 英语 (加拿大)" },
      { name: "en-HK-YanNeural", label: "Microsoft Yan 在线 (自然) - 英语 (香港特别行政区)" },
      { name: "en-HK-SamNeural", label: "Microsoft Sam 在线 (自然) - 英语 (香港)" },
      { name: "en-IN-NeerjaExpressiveNeural", label: "Microsoft Neerja 在线 (自然) - 英语 (印度) (预览)" },
      { name: "en-IN-NeerjaNeural", label: "Microsoft Neerja 在线 (自然) - 英语 (印度)" },
      { name: "en-IN-PrabhatNeural", label: "Microsoft Prabhat 在线 (自然) - 英语 (印度)" },
      { name: "en-IE-ConnorNeural", label: "Microsoft Connor 在线 (自然) - 英语 (爱尔兰)" },
      { name: "en-IE-EmilyNeural", label: "Microsoft Emily 在线 (自然) - 英语 (爱尔兰)" },
      { name: "en-KE-AsiliaNeural", label: "Microsoft Asilia 在线 (自然) - 英语 (肯尼亚)" },
      { name: "en-KE-ChilembaNeural", label: "Microsoft Chilemba 在线 (自然) - 英语 (肯尼亚)" },
      { name: "en-NZ-MitchellNeural", label: "Microsoft Mitchell 在线 (自然) - 英语 (新西兰)" },
      { name: "en-NZ-MollyNeural", label: "Microsoft Molly 在线 (自然) - 英语 (新西兰)" },
      { name: "en-NG-AbeoNeural", label: "Microsoft Abeo 在线 (自然) - 英语 (尼日利亚)" },
      { name: "en-NG-EzinneNeural", label: "Microsoft Ezinne 在线 (自然) - 英语 (尼日利亚)" },
      { name: "en-PH-JamesNeural", label: "Microsoft James 在线 (自然) - 英语 (菲律宾)" },
      { name: "en-PH-RosaNeural", label: "Microsoft Rosa 在线 (自然) - 英语 (菲律宾)" },
      { name: "en-US-AvaNeural", label: "Microsoft Ava 在线 (自然) - 英语 (美国)" },
      { name: "en-US-AndrewNeural", label: "Microsoft Andrew 在线 (自然) - 英语 (美国)" },
      { name: "en-US-EmmaNeural", label: "Microsoft Emma 在线 (自然) - 英语 (美国)" },
      { name: "en-US-BrianNeural", label: "Microsoft Brian 在线 (自然) - 英语 (美国)" },
      { name: "en-SG-LunaNeural", label: "Microsoft Luna 在线 (自然) - 英语 (新加坡)" },
      { name: "en-SG-WayneNeural", label: "Microsoft Wayne 在线 (自然) - 英语 (新加坡)" },
      { name: "en-ZA-LeahNeural", label: "Microsoft Leah 在线 (自然) - 英语 (南非)" },
      { name: "en-ZA-LukeNeural", label: "Microsoft Luke 在线 (自然) - 英语 (南非)" },
      { name: "en-TZ-ElimuNeural", label: "Microsoft Elimu 在线 (自然) - 英语 (坦桑尼亚)" },
      { name: "en-TZ-ImaniNeural", label: "Microsoft Imani 在线 (自然) - 英语 (坦桑尼亚)" },
      { name: "en-GB-LibbyNeural", label: "Microsoft Libby 在线 (自然) - 英语 (英国)" },
      { name: "en-GB-MaisieNeural", label: "Microsoft Maisie 在线 (自然) - 英语 (英国)" },
      { name: "en-GB-RyanNeural", label: "Microsoft Ryan 在线 (自然) - 英语 (英国)" },
      { name: "en-GB-SoniaNeural", label: "Microsoft Sonia 在线 (自然) - 英语 (英国)" },
      { name: "en-GB-ThomasNeural", label: "Microsoft Thomas 在线 (自然) - 英语 (英国)" },
      { name: "en-US-AnaNeural", label: "Microsoft Ana 在线 (自然) - 英语 (美国)" },
      { name: "en-US-AndrewMultilingualNeural", label: "Microsoft AndrewMultilingual 在线 (自然) - 英语 (美国)" },
      { name: "en-US-AriaNeural", label: "Microsoft Aria 在线 (自然) - 英语 (美国)" },
      { name: "en-US-AvaMultilingualNeural", label: "Microsoft AvaMultilingual 在线 (自然) - 英语 (美国)" },
      { name: "en-US-BrianMultilingualNeural", label: "Microsoft BrianMultilingual 在线 (自然) - 英语 (美国)" },
      { name: "en-US-ChristopherNeural", label: "Microsoft Christopher 在线 (自然) - 英语 (美国)" },
      { name: "en-US-EmmaMultilingualNeural", label: "Microsoft EmmaMultilingual 在线 (自然) - 英语 (美国)" },
      { name: "en-US-EricNeural", label: "Microsoft Eric 在线 (自然) - 英语 (美国)" },
      { name: "en-US-GuyNeural", label: "Microsoft Guy 在线 (自然) - 英语 (美国)" },
      { name: "en-US-JennyNeural", label: "Microsoft Jenny 在线 (自然) - 英语 (美国)" },
      { name: "en-US-MichelleNeural", label: "Microsoft Michelle 在线 (自然) - 英语 (美国)" },
      { name: "en-US-RogerNeural", label: "Microsoft Roger 在线 (自然) - 英语 (美国)" },
      { name: "en-US-SteffanNeural", label: "Microsoft Steffan 在线 (自然) - 英语 (美国)" },
      { name: "et-EE-AnuNeural", label: "Microsoft Anu 在线 (自然) - 爱沙尼亚语 (爱沙尼亚)" },
      { name: "et-EE-KertNeural", label: "Microsoft Kert 在线 (自然) - 爱沙尼亚语 (爱沙尼亚)" },
      { name: "fil-PH-AngeloNeural", label: "Microsoft Angelo 在线 (自然) - 菲律宾语 (菲律宾)" },
      { name: "fil-PH-BlessicaNeural", label: "Microsoft Blessica 在线 (自然) - 菲律宾语 (菲律宾)" },
      { name: "fi-FI-HarriNeural", label: "Microsoft Harri 在线 (自然) - 芬兰语 (芬兰)" },
      { name: "fi-FI-NooraNeural", label: "Microsoft Noora 在线 (自然) - 芬兰语 (芬兰)" },
      { name: "fr-BE-CharlineNeural", label: "Microsoft Charline 在线 (自然) - 法语 (比利时)" },
      { name: "fr-BE-GerardNeural", label: "Microsoft Gerard 在线 (自然) - 法语 (比利时)" },
      { name: "fr-CA-ThierryNeural", label: "Microsoft Thierry 在线 (自然) - 法语 (加拿大)" },
      { name: "fr-CA-AntoineNeural", label: "Microsoft Antoine 在线 (自然) - 法语 (加拿大)" },
      { name: "fr-CA-JeanNeural", label: "Microsoft Jean 在线 (自然) - 法语 (加拿大)" },
      { name: "fr-CA-SylvieNeural", label: "Microsoft Sylvie 在线 (自然) - 法语 (加拿大)" },
      { name: "fr-FR-VivienneMultilingualNeural", label: "Microsoft VivienneMultilingual 在线 (自然) - 法语 (法国)" },
      { name: "fr-FR-RemyMultilingualNeural", label: "Microsoft RemyMultilingual 在线 (自然) - 法语 (法国)" },
      { name: "fr-FR-DeniseNeural", label: "Microsoft Denise 在线 (自然) - 法语 (法国)" },
      { name: "fr-FR-EloiseNeural", label: "Microsoft Eloise 在线 (自然) - 法语 (法国)" },
      { name: "fr-FR-HenriNeural", label: "Microsoft Henri 在线 (自然) - 法语 (法国)" },
      { name: "fr-CH-ArianeNeural", label: "Microsoft Ariane 在线 (自然) - 法语 (瑞士)" },
      { name: "fr-CH-FabriceNeural", label: "Microsoft Fabrice 在线 (自然) - 法语 (瑞士)" },
      { name: "gl-ES-RoiNeural", label: "Microsoft Roi 在线 (自然) - 加利西亚语" },
      { name: "gl-ES-SabelaNeural", label: "Microsoft Sabela 在线 (自然) - 加利西亚语" },
      { name: "ka-GE-EkaNeural", label: "Microsoft Eka 在线 (自然) - 格鲁吉亚语 (格鲁吉亚)" },
      { name: "ka-GE-GiorgiNeural", label: "Microsoft Giorgi 在线 (自然) - 格鲁吉亚语 (格鲁吉亚)" },
      { name: "de-AT-IngridNeural", label: "Microsoft Ingrid 在线 (自然) - 德语 (奥地利)" },
      { name: "de-AT-JonasNeural", label: "Microsoft Jonas 在线 (自然) - 德语 (奥地利)" },
      { name: "de-DE-SeraphinaMultilingualNeural", label: "Microsoft SeraphinaMultilingual 在线 (自然) - 德语 (德国)" },
      { name: "de-DE-FlorianMultilingualNeural", label: "Microsoft FlorianMultilingual 在线 (自然) - 德语 (德国)" },
      { name: "de-DE-AmalaNeural", label: "Microsoft Amala 在线 (自然) - 德语 (德国)" },
      { name: "de-DE-ConradNeural", label: "Microsoft Conrad 在线 (自然) - 德语 (德国)" },
      { name: "de-DE-KatjaNeural", label: "Microsoft Katja 在线 (自然) - 德语 (德国)" },
      { name: "de-DE-KillianNeural", label: "Microsoft Killian 在线 (自然) - 德语 (德国)" },
      { name: "de-CH-JanNeural", label: "Microsoft Jan 在线 (自然) - 德语 (瑞士)" },
      { name: "de-CH-LeniNeural", label: "Microsoft Leni 在线 (自然) - 德语 (瑞士)" },
      { name: "el-GR-AthinaNeural", label: "Microsoft Athina 在线 (自然) - 希腊语 (希腊)" },
      { name: "el-GR-NestorasNeural", label: "Microsoft Nestoras 在线 (自然) - 希腊语 (希腊)" },
      { name: "gu-IN-DhwaniNeural", label: "Microsoft Dhwani 在线 (自然) - 古吉拉特语 (印度)" },
      { name: "gu-IN-NiranjanNeural", label: "Microsoft Niranjan 在线 (自然) - 古吉拉特语 (印度)" },
      { name: "he-IL-AvriNeural", label: "Microsoft Avri 在线 (自然) - 希伯来语 (以色列)" },
      { name: "he-IL-HilaNeural", label: "Microsoft Hila 在线 (自然) - 希伯来语 (以色列)" },
      { name: "hi-IN-MadhurNeural", label: "Microsoft Madhur 在线 (自然) - 印地语 (印度)" },
      { name: "hi-IN-SwaraNeural", label: "Microsoft Swara 在线 (自然) - 印地语 (印度)" },
      { name: "hu-HU-NoemiNeural", label: "Microsoft Noemi 在线 (自然) - 匈牙利语 (匈牙利)" },
      { name: "hu-HU-TamasNeural", label: "Microsoft Tamas 在线 (自然) - 匈牙利语 (匈牙利)" },
      { name: "is-IS-GudrunNeural", label: "Microsoft Gudrun 在线 (自然) - 冰岛语 (冰岛)" },
      { name: "is-IS-GunnarNeural", label: "Microsoft Gunnar 在线 (自然) - 冰岛语 (冰岛)" },
      { name: "id-ID-ArdiNeural", label: "Microsoft Ardi 在线 (自然) - 印尼语 (印度尼西亚)" },
      { name: "id-ID-GadisNeural", label: "Microsoft Gadis 在线 (自然) - 印尼语 (印度尼西亚)" },
      { name: "iu-Latn-CA-SiqiniqNeural", label: "Microsoft Siqiniq 在线 (自然) - 因纽特语 (拉丁文，加拿大)" },
      { name: "iu-Latn-CA-TaqqiqNeural", label: "Microsoft Taqqiq 在线 (自然) - 因纽特语 (拉丁文，加拿大)" },
      { name: "iu-Cans-CA-SiqiniqNeural", label: "Microsoft Siqiniq 在线 (自然) - 因纽特语 (音节文字，加拿大)" },
      { name: "iu-Cans-CA-TaqqiqNeural", label: "Microsoft Taqqiq 在线 (自然) - 因纽特语 (音节文字，加拿大)" },
      { name: "ga-IE-ColmNeural", label: "Microsoft Colm 在线 (自然) - 爱尔兰语 (爱尔兰)" },
      { name: "ga-IE-OrlaNeural", label: "Microsoft Orla 在线 (自然) - 爱尔兰语 (爱尔兰)" },
      { name: "it-IT-GiuseppeMultilingualNeural", label: "Microsoft GiuseppeMultilingual 在线 (自然) - 意大利语 (意大利)" },
      { name: "it-IT-DiegoNeural", label: "Microsoft Diego 在线 (自然) - 意大利语 (意大利)" },
      { name: "it-IT-ElsaNeural", label: "Microsoft Elsa 在线 (自然) - 意大利语 (意大利)" },
      { name: "it-IT-IsabellaNeural", label: "Microsoft Isabella 在线 (自然) - 意大利语 (意大利)" },
      { name: "ja-JP-KeitaNeural", label: "Microsoft Keita 在线 (自然) - 日语 (日本)" },
      { name: "ja-JP-NanamiNeural", label: "Microsoft Nanami 在线 (自然) - 日语 (日本)" },
      { name: "jv-ID-DimasNeural", label: "Microsoft Dimas 在线 (自然) - 爪哇语 (印度尼西亚)" },
      { name: "jv-ID-SitiNeural", label: "Microsoft Siti 在线 (自然) - 爪哇语 (印度尼西亚)" },
      { name: "kn-IN-GaganNeural", label: "Microsoft Gagan 在线 (自然) - 卡纳达语 (印度)" },
      { name: "kn-IN-SapnaNeural", label: "Microsoft Sapna 在线 (自然) - 卡纳达语 (印度)" },
      { name: "kk-KZ-AigulNeural", label: "Microsoft Aigul 在线 (自然) - 哈萨克语 (哈萨克斯坦)" },
      { name: "kk-KZ-DauletNeural", label: "Microsoft Daulet 在线 (自然) - 哈萨克语 (哈萨克斯坦)" },
      { name: "km-KH-PisethNeural", label: "Microsoft Piseth 在线 (自然) - 高棉语 (柬埔寨)" },
      { name: "km-KH-SreymomNeural", label: "Microsoft Sreymom 在线 (自然) - 高棉语 (柬埔寨)" },
      { name: "ko-KR-HyunsuMultilingualNeural", label: "Microsoft HyunsuMultilingual 在线 (自然) - 韩语 (韩国)" },
      { name: "ko-KR-InJoonNeural", label: "Microsoft InJoon 在线 (自然) - 韩语 (韩国)" },
      { name: "ko-KR-SunHiNeural", label: "Microsoft SunHi 在线 (自然) - 韩语 (韩国)" },
      { name: "lo-LA-ChanthavongNeural", label: "Microsoft Chanthavong 在线 (自然) - 老挝语 (老挝)" },
      { name: "lo-LA-KeomanyNeural", label: "Microsoft Keomany 在线 (自然) - 老挝语 (老挝)" },
      { name: "lv-LV-EveritaNeural", label: "Microsoft Everita 在线 (自然) - 拉脱维亚语 (拉脱维亚)" },
      { name: "lv-LV-NilsNeural", label: "Microsoft Nils 在线 (自然) - 拉脱维亚语 (拉脱维亚)" },
      { name: "lt-LT-LeonasNeural", label: "Microsoft Leonas 在线 (自然) - 立陶宛语 (立陶宛)" },
      { name: "lt-LT-OnaNeural", label: "Microsoft Ona 在线 (自然) - 立陶宛语 (立陶宛)" },
      { name: "mk-MK-AleksandarNeural", label: "Microsoft Aleksandar 在线 (自然) - 马其顿语 (北马其顿)" },
      { name: "mk-MK-MarijaNeural", label: "Microsoft Marija 在线 (自然) - 马其顿语 (北马其顿)" },
      { name: "ms-MY-OsmanNeural", label: "Microsoft Osman 在线 (自然) - 马来语 (马来西亚)" },
      { name: "ms-MY-YasminNeural", label: "Microsoft Yasmin 在线 (自然) - 马来语 (马来西亚)" },
      { name: "ml-IN-MidhunNeural", label: "Microsoft Midhun 在线 (自然) - 马拉雅拉姆语 (印度)" },
      { name: "ml-IN-SobhanaNeural", label: "Microsoft Sobhana 在线 (自然) - 马拉雅拉姆语 (印度)" },
      { name: "mt-MT-GraceNeural", label: "Microsoft Grace 在线 (自然) - 马耳他语 (马耳他)" },
      { name: "mt-MT-JosephNeural", label: "Microsoft Joseph 在线 (自然) - 马耳他语 (马耳他)" },
      { name: "mr-IN-AarohiNeural", label: "Microsoft Aarohi 在线 (自然) - 马拉地语 (印度)" },
      { name: "mr-IN-ManoharNeural", label: "Microsoft Manohar 在线 (自然) - 马拉地语 (印度)" },
      { name: "mn-MN-BataaNeural", label: "Microsoft Bataa 在线 (自然) - 蒙古语 (蒙古)" },
      { name: "mn-MN-YesuiNeural", label: "Microsoft Yesui 在线 (自然) - 蒙古语 (蒙古)" },
      { name: "ne-NP-HemkalaNeural", label: "Microsoft Hemkala 在线 (自然) - 尼泊尔语 (尼泊尔)" },
      { name: "ne-NP-SagarNeural", label: "Microsoft Sagar 在线 (自然) - 尼泊尔语 (尼泊尔)" },
      { name: "nb-NO-FinnNeural", label: "Microsoft Finn 在线 (自然) - 挪威语 (书面挪威语，挪威)" },
      { name: "nb-NO-PernilleNeural", label: "Microsoft Pernille 在线 (自然) - 挪威语 (书面挪威语，挪威)" },
      { name: "ps-AF-GulNawazNeural", label: "Microsoft GulNawaz 在线 (自然) - 普什图语 (阿富汗)" },
      { name: "ps-AF-LatifaNeural", label: "Microsoft Latifa 在线 (自然) - 普什图语 (阿富汗)" },
      { name: "fa-IR-DilaraNeural", label: "Microsoft Dilara 在线 (自然) - 波斯语 (伊朗)" },
      { name: "fa-IR-FaridNeural", label: "Microsoft Farid 在线 (自然) - 波斯语 (伊朗)" },
      { name: "pl-PL-MarekNeural", label: "Microsoft Marek 在线 (自然) - 波兰语 (波兰)" },
      { name: "pl-PL-ZofiaNeural", label: "Microsoft Zofia 在线 (自然) - 波兰语 (波兰)" },
      { name: "pt-BR-ThalitaMultilingualNeural", label: "Microsoft ThalitaMultilingual 在线 (自然) - 葡萄牙语 (巴西)" },
      { name: "pt-BR-AntonioNeural", label: "Microsoft Antonio 在线 (自然) - 葡萄牙语 (巴西)" },
      { name: "pt-BR-FranciscaNeural", label: "Microsoft Francisca 在线 (自然) - 葡萄牙语 (巴西)" },
      { name: "pt-PT-DuarteNeural", label: "Microsoft Duarte 在线 (自然) - 葡萄牙语 (葡萄牙)" },
      { name: "pt-PT-RaquelNeural", label: "Microsoft Raquel 在线 (自然) - 葡萄牙语 (葡萄牙)" },
      { name: "ro-RO-AlinaNeural", label: "Microsoft Alina 在线 (自然) - 罗马尼亚语 (罗马尼亚)" },
      { name: "ro-RO-EmilNeural", label: "Microsoft Emil 在线 (自然) - 罗马尼亚语 (罗马尼亚)" },
      { name: "ru-RU-DmitryNeural", label: "Microsoft Dmitry 在线 (自然) - 俄语 (俄罗斯)" },
      { name: "ru-RU-SvetlanaNeural", label: "Microsoft Svetlana 在线 (自然) - 俄语 (俄罗斯)" },
      { name: "sr-RS-NicholasNeural", label: "Microsoft Nicholas 在线 (自然) - 塞尔维亚语 (塞尔维亚)" },
      { name: "sr-RS-SophieNeural", label: "Microsoft Sophie 在线 (自然) - 塞尔维亚语 (塞尔维亚)" },
      { name: "si-LK-SameeraNeural", label: "Microsoft Sameera 在线 (自然) - 僧伽罗语 (斯里兰卡)" },
      { name: "si-LK-ThiliniNeural", label: "Microsoft Thilini 在线 (自然) - 僧伽罗语 (斯里兰卡)" },
      { name: "sk-SK-LukasNeural", label: "Microsoft Lukas 在线 (自然) - 斯洛伐克语 (斯洛伐克)" },
      { name: "sk-SK-ViktoriaNeural", label: "Microsoft Viktoria 在线 (自然) - 斯洛伐克语 (斯洛伐克)" },
      { name: "sl-SI-PetraNeural", label: "Microsoft Petra 在线 (自然) - 斯洛文尼亚语 (斯洛文尼亚)" },
      { name: "sl-SI-RokNeural", label: "Microsoft Rok 在线 (自然) - 斯洛文尼亚语 (斯洛文尼亚)" },
      { name: "so-SO-MuuseNeural", label: "Microsoft Muuse 在线 (自然) - 索马里语 (索马里)" },
      { name: "so-SO-UbaxNeural", label: "Microsoft Ubax 在线 (自然) - 索马里语 (索马里)" },
      { name: "es-AR-ElenaNeural", label: "Microsoft Elena 在线 (自然) - 西班牙语 (阿根廷)" },
      { name: "es-AR-TomasNeural", label: "Microsoft Tomas 在线 (自然) - 西班牙语 (阿根廷)" },
      { name: "es-BO-MarceloNeural", label: "Microsoft Marcelo 在线 (自然) - 西班牙语 (玻利维亚)" },
      { name: "es-BO-SofiaNeural", label: "Microsoft Sofia 在线 (自然) - 西班牙语 (玻利维亚)" },
      { name: "es-CL-CatalinaNeural", label: "Microsoft Catalina 在线 (自然) - 西班牙语 (智利)" },
      { name: "es-CL-LorenzoNeural", label: "Microsoft Lorenzo 在线 (自然) - 西班牙语 (智利)" },
      { name: "es-CO-GonzaloNeural", label: "Microsoft Gonzalo 在线 (自然) - 西班牙语 (哥伦比亚)" },
      { name: "es-CO-SalomeNeural", label: "Microsoft Salome 在线 (自然) - 西班牙语 (哥伦比亚)" },
      { name: "es-ES-XimenaNeural", label: "Microsoft Ximena 在线 (自然) - 西班牙语 (哥伦比亚)" },
      { name: "es-CR-JuanNeural", label: "Microsoft Juan 在线 (自然) - 西班牙语 (哥斯达黎加)" },
      { name: "es-CR-MariaNeural", label: "Microsoft Maria 在线 (自然) - 西班牙语 (哥斯达黎加)" },
      { name: "es-CU-BelkysNeural", label: "Microsoft Belkys 在线 (自然) - 西班牙语 (古巴)" },
      { name: "es-CU-ManuelNeural", label: "Microsoft Manuel 在线 (自然) - 西班牙语 (古巴)" },
      { name: "es-DO-EmilioNeural", label: "Microsoft Emilio 在线 (自然) - 西班牙语 (多米尼加共和国)" },
      { name: "es-DO-RamonaNeural", label: "Microsoft Ramona 在线 (自然) - 西班牙语 (多米尼加共和国)" },
      { name: "es-EC-AndreaNeural", label: "Microsoft Andrea 在线 (自然) - 西班牙语 (厄瓜多尔)" },
      { name: "es-EC-LuisNeural", label: "Microsoft Luis 在线 (自然) - 西班牙语 (厄瓜多尔)" },
      { name: "es-SV-LorenaNeural", label: "Microsoft Lorena 在线 (自然) - 西班牙语 (萨尔瓦多)" },
      { name: "es-SV-RodrigoNeural", label: "Microsoft Rodrigo 在线 (自然) - 西班牙语 (萨尔瓦多)" },
      { name: "es-GQ-JavierNeural", label: "Microsoft Javier 在线 (自然) - 西班牙语 (赤道几内亚)" },
      { name: "es-GQ-TeresaNeural", label: "Microsoft Teresa 在线 (自然) - 西班牙语 (赤道几内亚)" },
      { name: "es-GT-AndresNeural", label: "Microsoft Andres 在线 (自然) - 西班牙语 (危地马拉)" },
      { name: "es-GT-MartaNeural", label: "Microsoft Marta 在线 (自然) - 西班牙语 (危地马拉)" },
      { name: "es-HN-CarlosNeural", label: "Microsoft Carlos 在线 (自然) - 西班牙语 (洪都拉斯)" },
      { name: "es-HN-KarlaNeural", label: "Microsoft Karla 在线 (自然) - 西班牙语 (洪都拉斯)" },
      { name: "es-MX-DaliaNeural", label: "Microsoft Dalia 在线 (自然) - 西班牙语 (墨西哥)" },
      { name: "es-MX-JorgeNeural", label: "Microsoft Jorge 在线 (自然) - 西班牙语 (墨西哥)" },
      { name: "es-NI-FedericoNeural", label: "Microsoft Federico 在线 (自然) - 西班牙语 (尼加拉瓜)" },
      { name: "es-NI-YolandaNeural", label: "Microsoft Yolanda 在线 (自然) - 西班牙语 (尼加拉瓜)" },
      { name: "es-PA-MargaritaNeural", label: "Microsoft Margarita 在线 (自然) - 西班牙语 (巴拿马)" },
      { name: "es-PA-RobertoNeural", label: "Microsoft Roberto 在线 (自然) - 西班牙语 (巴拿马)" },
      { name: "es-PY-MarioNeural", label: "Microsoft Mario 在线 (自然) - 西班牙语 (巴拉圭)" },
      { name: "es-PY-TaniaNeural", label: "Microsoft Tania 在线 (自然) - 西班牙语 (巴拉圭)" },
      { name: "es-PE-AlexNeural", label: "Microsoft Alex 在线 (自然) - 西班牙语 (秘鲁)" },
      { name: "es-PE-CamilaNeural", label: "Microsoft Camila 在线 (自然) - 西班牙语 (秘鲁)" },
      { name: "es-PR-KarinaNeural", label: "Microsoft Karina 在线 (自然) - 西班牙语 (波多黎各)" },
      { name: "es-PR-VictorNeural", label: "Microsoft Victor 在线 (自然) - 西班牙语 (波多黎各)" },
      { name: "es-ES-AlvaroNeural", label: "Microsoft Alvaro 在线 (自然) - 西班牙语 (西班牙)" },
      { name: "es-ES-ElviraNeural", label: "Microsoft Elvira 在线 (自然) - 西班牙语 (西班牙)" },
      { name: "es-US-AlonsoNeural", label: "Microsoft Alonso 在线 (自然) - 西班牙语 (美国)" },
      { name: "es-US-PalomaNeural", label: "Microsoft Paloma 在线 (自然) - 西班牙语 (美国)" },
      { name: "es-UY-MateoNeural", label: "Microsoft Mateo 在线 (自然) - 西班牙语 (乌拉圭)" },
      { name: "es-UY-ValentinaNeural", label: "Microsoft Valentina 在线 (自然) - 西班牙语 (乌拉圭)" },
      { name: "es-VE-PaolaNeural", label: "Microsoft Paola 在线 (自然) - 西班牙语 (委内瑞拉)" },
      { name: "es-VE-SebastianNeural", label: "Microsoft Sebastian 在线 (自然) - 西班牙语 (委内瑞拉)" },
      { name: "su-ID-JajangNeural", label: "Microsoft Jajang 在线 (自然) - 巽他语 (印度尼西亚)" },
      { name: "su-ID-TutiNeural", label: "Microsoft Tuti 在线 (自然) - 巽他语 (印度尼西亚)" },
      { name: "sw-KE-RafikiNeural", label: "Microsoft Rafiki 在线 (自然) - 斯瓦希里语 (肯尼亚)" },
      { name: "sw-KE-ZuriNeural", label: "Microsoft Zuri 在线 (自然) - 斯瓦希里语 (肯尼亚)" },
      { name: "sw-TZ-DaudiNeural", label: "Microsoft Daudi 在线 (自然) - 斯瓦希里语 (坦桑尼亚)" },
      { name: "sw-TZ-RehemaNeural", label: "Microsoft Rehema 在线 (自然) - 斯瓦希里语 (坦桑尼亚)" },
      { name: "sv-SE-MattiasNeural", label: "Microsoft Mattias 在线 (自然) - 瑞典语 (瑞典)" },
      { name: "sv-SE-SofieNeural", label: "Microsoft Sofie 在线 (自然) - 瑞典语 (瑞典)" },
      { name: "ta-IN-PallaviNeural", label: "Microsoft Pallavi 在线 (自然) - 泰米尔语 (印度)" },
      { name: "ta-IN-ValluvarNeural", label: "Microsoft Valluvar 在线 (自然) - 泰米尔语 (印度)" },
      { name: "ta-MY-KaniNeural", label: "Microsoft Kani 在线 (自然) - 泰米尔语 (马来西亚)" },
      { name: "ta-MY-SuryaNeural", label: "Microsoft Surya 在线 (自然) - 泰米尔语 (马来西亚)" },
      { name: "ta-SG-AnbuNeural", label: "Microsoft Anbu 在线 (自然) - 泰米尔语 (新加坡)" },
      { name: "ta-SG-VenbaNeural", label: "Microsoft Venba 在线 (自然) - 泰米尔语 (新加坡)" },
      { name: "ta-LK-KumarNeural", label: "Microsoft Kumar 在线 (自然) - 泰米尔语 (斯里兰卡)" },
      { name: "ta-LK-SaranyaNeural", label: "Microsoft Saranya 在线 (自然) - 泰米尔语 (斯里兰卡)" },
      { name: "te-IN-MohanNeural", label: "Microsoft Mohan 在线 (自然) - 泰卢固语 (印度)" },
      { name: "te-IN-ShrutiNeural", label: "Microsoft Shruti 在线 (自然) - 泰卢固语 (印度)" },
      { name: "th-TH-NiwatNeural", label: "Microsoft Niwat 在线 (自然) - 泰语 (泰国)" },
      { name: "th-TH-PremwadeeNeural", label: "Microsoft Premwadee 在线 (自然) - 泰语 (泰国)" },
      { name: "tr-TR-EmelNeural", label: "Microsoft Emel 在线 (自然) - 土耳其语 (土耳其)" },
      { name: "tr-TR-AhmetNeural", label: "Microsoft Ahmet 在线 (自然) - 土耳其语 (土耳其)" },
      { name: "uk-UA-OstapNeural", label: "Microsoft Ostap 在线 (自然) - 乌克兰语 (乌克兰)" },
      { name: "uk-UA-PolinaNeural", label: "Microsoft Polina 在线 (自然) - 乌克兰语 (乌克兰)" },
      { name: "ur-IN-GulNeural", label: "Microsoft Gul 在线 (自然) - 乌尔都语 (印度)" },
      { name: "ur-IN-SalmanNeural", label: "Microsoft Salman 在线 (自然) - 乌尔都语 (印度)" },
      { name: "ur-PK-AsadNeural", label: "Microsoft Asad 在线 (自然) - 乌尔都语 (巴基斯坦)" },
      { name: "ur-PK-UzmaNeural", label: "Microsoft Uzma 在线 (自然) - 乌尔都语 (巴基斯坦)" },
      { name: "uz-UZ-MadinaNeural", label: "Microsoft Madina 在线 (自然) - 乌兹别克语 (乌兹别克斯坦)" },
      { name: "uz-UZ-SardorNeural", label: "Microsoft Sardor 在线 (自然) - 乌兹别克语 (乌兹别克斯坦)" },
      { name: "vi-VN-HoaiMyNeural", label: "Microsoft HoaiMy 在线 (自然) - 越南语 (越南)" },
      { name: "vi-VN-NamMinhNeural", label: "Microsoft NamMinh 在线 (自然) - 越南语 (越南)" },
      { name: "cy-GB-AledNeural", label: "Microsoft Aled 在线 (自然) - 威尔士语 (英国)" },
      { name: "cy-GB-NiaNeural", label: "Microsoft Nia 在线 (自然) - 威尔士语 (英国)" },
      { name: "zu-ZA-ThandoNeural", label: "Microsoft Thando 在线 (自然) - 祖鲁语 (南非)" },
      { name: "zu-ZA-ThembaNeural", label: "Microsoft Themba 在线 (自然) - 祖鲁语 (南非)" }
    ];
    // 初始化 selectedVoice 为 'name'，而不是 label，供内部使用。
    this.selectedVoice = this.voices[0].name; // 改为存储 'name'
  }

  getInfo() {
    return {
      id: 'edgetts',
      name: 'Edge TTS',
      blocks: [
        {
          opcode: 'setVoice',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置语音为 [VOICE]',
          arguments: {
            VOICE: {
              type: Scratch.ArgumentType.STRING,
              menu: 'voices',
              defaultValue: this.voices[0].name // 确保默认值是 name
            }
          }
        },
        // 新积木: 随机设置语音
        {
          opcode: 'setRandomVoice',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置语音为随机'
        },
        {
          opcode: 'generateSpeech',
          blockType: Scratch.BlockType.COMMAND,
          text: '生成语音从 [TEXT]',
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '你好，世界'
            }
          }
        },
        {
          opcode: 'playSpeech',
          blockType: Scratch.BlockType.COMMAND,
          text: '播放生成的语音'
        },
        {
          opcode: 'saveSpeechToSprite',
          blockType: Scratch.BlockType.COMMAND,
          text: '保存语音到此角色为 [SOUNDNAME]',
          arguments: {
            SOUNDNAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'TTS 语音'
            }
          }
        },
        {
          opcode: 'downloadSpeech',
          blockType: Scratch.BlockType.COMMAND,
          text: '下载语音为 [FILENAME]',
          arguments: {
            FILENAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'tts.mp3'
            }
          }
        },
        // 新积木: 当前选择的语音 (报告器)
        {
          opcode: 'getCurrentVoice',
          blockType: Scratch.BlockType.REPORTER,
          text: '已选择的语音'
        }
      ],
      menus: {
        voices: this.voices.map(v => ({ text: v.label, value: v.name }))
      }
    };
  }

  setVoice(args) {
    // args.VOICE 现在将正确包含 ShortName (例如 "en-US-AvaNeural")
    this.selectedVoice = args.VOICE;
    console.warn(`语音已设置为: ${this.selectedVoice}`);
  }

  // 新方法: setRandomVoice
  setRandomVoice() {
    const randomIndex = Math.floor(Math.random() * this.voices.length);
    this.selectedVoice = this.voices[randomIndex].name;
    console.warn(`语音已随机设置为: ${this.selectedVoice}`);
  }

  async generateSpeech(args) {
    const text = encodeURIComponent(args.TEXT);
    const voice = encodeURIComponent(this.selectedVoice);

    const url = `https://pmedgetts.onrender.com/tts?voice=${voice}&text=${text}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP 错误 ${response.status}`);

      const blob = await response.blob();
      this.currentAudioBlob = blob;

      if (this.currentAudioUrl) {
        URL.revokeObjectURL(this.currentAudioUrl);
      }
      this.currentAudioUrl = URL.createObjectURL(blob);

      console.log('语音生成成功!');
    } catch (e) {
      console.error('生成语音时出错:', e);
    }
  }

  playSpeech() {
    if (!this.currentAudioUrl) {
      console.warn('没有生成的语音可供播放。');
      return;
    }
    const audio = new Audio(this.currentAudioUrl);
    audio.play();
  }

  async saveSpeechToSprite(args) {
    if (!this.currentAudioBlob) {
      console.warn('尚未生成语音。请先使用"生成语音"。');
      return;
    }
    if (!this.runtime) {
      console.error('Scratch 运行时环境不可用，无法保存声音');
      return;
    }

    try {
      const target = this.runtime.getEditingTarget();
      if (!target) {
        console.error('没有可用的编辑目标');
        return;
      }

      const arrayBuffer = await this.currentAudioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const storage = this.runtime.storage;
      const asset = new storage.Asset(
        storage.AssetType.Sound,
        null,
        storage.DataFormat.MP3,
        uint8Array,
        true
      );

      // 使用 Scratch.vm 添加声音，而不是 this.runtime
      await Scratch.vm.addSound({
        md5: asset.assetId + '.' + asset.dataFormat,
        asset: asset,
        name: args.SOUNDNAME || 'TTS 语音'
      }, target.id);

      console.log(`已将声音 "${args.SOUNDNAME}" 保存到角色。`);
    } catch (e) {
      console.error('将语音保存到角色时出错:', e);
    }
  }

  downloadSpeech(args) {
    if (!this.currentAudioBlob) {
      console.warn('尚未生成语音。请先使用"生成语音"。');
      return;
    }

    const filename = args.FILENAME || 'tts.mp3';

    const url = URL.createObjectURL(this.currentAudioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  // 新方法: getCurrentVoice
  getCurrentVoice() {
    // 查找与当前所选语音名称对应的标签
    const voice = this.voices.find(v => v.name === this.selectedVoice);
    return voice ? voice.label : '未知语音';
  }
}

Scratch.extensions.register(new EdgeTTS(Scratch.vm.runtime));
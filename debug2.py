f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
h = f.read()
f.close()

# 查看 header 信息
i = h.find('<div class="header">')
print("=== Header ===")
print(h[i:i+400])

# 查看 exportPDF 函数
j = h.find('function exportPDF')
print("\n=== exportPDF ===")
print(h[j:j+800])
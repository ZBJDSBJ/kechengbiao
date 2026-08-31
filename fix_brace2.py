f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
h = f.read()
f.close()

# 用位置定位：找到 catch 中的 "})}}function cycleTheme" 模式
# 使用不含 emoji 的部分来定位
idx = h.find(')})}}function cycleTheme')
print("Pattern at:", idx)

if idx > 0:
    # 将 "})}}function cycleTheme" 替换为 "})}function cycleTheme"
    h = h[:idx] + '})}function cycleTheme' + h[idx+len(')})}}function cycleTheme'):]
    f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
    f.write(h)
    f.close()
    print("Fixed! Size:", len(h.encode('utf-8')))
else:
    print("Pattern not found!")
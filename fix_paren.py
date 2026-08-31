f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
h = f.read()
f.close()

# showToast("...重试"})} 缺少右括号，应为 showToast("...重试")})}
old = '请稍后重试"})}function cycleTheme'
new = '请稍后重试")})}function cycleTheme'

if old in h:
    h = h.replace(old, new, 1)
    f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
    f.write(h)
    f.close()
    print("Fixed! Size:", len(h.encode('utf-8')))
else:
    print("Pattern not found!")
f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
h = f.read()
f.close()

# 找到 pushToday 附近代码
i = h.find('function pushToday')
print("pushToday at:", i)
# 找到 testPush
j = h.find('function testPush')
print("testPush at:", j)

# 查看 testPush 后面的 300 字符
if j > 0:
    print("\n--- After testPush ---")
    # 找 testPush 函数结束
    seg = h[j:j+1200]
    end_idx = seg.find('})}', seg.find('.catch'))
    print(seg[:1200])
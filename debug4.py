f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
h = f.read()
f.close()

# 用位置定位修复：testPush 的 catch 结束后，删除多余 }
j = h.find('function testPush')
print("testPush at:", j)

# 找 testPush 函数体的结束：从 j 开始找 ".catch" 
seg_start = h.find('.catch(err=>{showToast("❌ 网络错误', j)
print("catch at:", seg_start)

# 从 catch 开始往后找连续的 }
if seg_start > 0:
    # 打印 catch 后 120 字符，查看确切内容
    print(repr(h[seg_start:seg_start+120]))
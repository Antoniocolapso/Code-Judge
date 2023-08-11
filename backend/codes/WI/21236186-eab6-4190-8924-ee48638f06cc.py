from queue import Queue
n,m=map(int,input().split())
adj=[[] for i in range(n)]
cap=[[0]*n for i in range(n)]
for i in range(m):
    x,y=map(int,input().split());x-=1;y-=1
    adj[x].append(y)
    adj[y].append(x)
    cap[x][y]=1
caporig=[x.copy() for x in cap]
 
p=[-1]*n
lv=[-1]*n
def bfs():
    global lv
    q=Queue()
    q.put(0)
    lv=[-1]*n
    lv[0]=0
    while not q.empty():
        f=q.get()
        for v in adj[f]:
            if cap[f][v] and lv[v]==-1:
                lv[v]=lv[f]+1
                q.put(v)
    return lv[-1]!=-1
def dfs(cur):
    global p
    if cur==n-1: return True    
    for v in adj[cur]:
        if cap[cur][v] and lv[cur]<lv[v]:
            p[v]=cur
            if dfs(v): return True
    return False
while True:
    bfs()
    nf=0
    while dfs(0):
        nf+=1
        cur=n-1
        while cur:
            x,y=p[cur],cur
            cap[x][y]-=1
            cap[y][x]+=1
            cur=p[cur]
    if nf==0: break
# after maxflow algo
 
def bfs2():
    global p
    q=Queue()
    q.put(0)
    p=[-1]*n
    p[0]=0
    while not q.empty():
        f=q.get()
        for v in adj[f]:
            if caporig[f][v] and not cap[f][v] and p[v]==-1:
                p[v]=f
                q.put(v)
    return p[-1]!=-1
paths=[]
while bfs2():
    cur=n-1
    path=[n-1]
    while cur:
        x,y=p[cur],cur
        caporig[x][y]=0
        cur=p[cur]
        path.append(cur)
    paths.append(path)
print(len(paths))
for path in paths:
    print(len(path))
    print(" ".join([str(i+1) for i in path[::-1]]))
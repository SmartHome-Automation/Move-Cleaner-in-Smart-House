# PHEONIX MARS QUESTERS (Mars Colonization Project)

Our project is a shortest path finding  web Application based on the theme "MARS COLONIZATION".
This project was build to establish a permanent human settlement on Mars.
Our Phoenix Mars Quester is artificially intelligent  machine capable of sensing and interacting with its environment and is our RATIONAL AGENT . Using our rover as rational agent gives the best possible outcome in every scenario, and provides the user the most optimised path from start to the and node. Our rover/agent thinks rationally which means it uses logic and syllogism before coming to any conclusion. After a rational thinking , it acts rationally using its actuators and most importantly thinks humanly. AI gives rover a computer vision to navigate, sense and calculate their reaction accordingly .Our rover mainly focuses on the development and analysis of algorithms which in other words means that it is a  machine having its own intelligence and behavior. Power source of our rover is sunlight making it economic and environmental friendly , as we know Mars, near the equator, the duration of daylight is about 12 hours hence we installed solar panels in our rover providing it unlimited power source.



# What can it do?
Our Pheonix Mars Quester is a mars rover which finds the shortest path between two points while avoiding obstacles on the way.

# How it works?
It finds the shortest path using the algorithm selected by the user.

# How is it related to ARITIFICIAL INTELLIGENCE?
When the user chooses High meteorite Hit region , our agent i.e. our rover uses its sensors which acts like its eyes and ears to sense the coordinates of meteorites and when the user chooses the algorithm it finds such a path which has the minimum cost of travelling , in which it may or may not contain meteorites this is where the rational thinking of our agent comes to play. It works considering the fact that meteorites are not impenetrable but also on the other hand are costlier than the nodes ,it first considers the facts that if there are walls present or not and if water is present on the grid or not .After considering each fact it decides the path with lowest possible cost and then it uses its actuators to act on that path and then creates the most optimised path it.


# Meet The Algorithms

The application supports the following algorithms :-

# 1. Dijkstra's Algorithm (weighted)
It is the father of pathfinding algorithms; guarantees the shortestpath, all of the nodes in the graph (except the starting node) are initialized with a distance equal to 'infinity.' These distances represents the cost to get from the starting node to the current node, with the starting node having a distance of zero. At the beginning of each iteration, the node with the smallest distance that hasn't been explored yet is visited. These nodes are stored in a min-heap data structure. When a node is visited, all of the neighbors' distances are updated, and if any of the neighbor's distances are lessened, then the algorithm pushes the node onto the min-heap. This continues until the end node has been reached.


<img width="956" alt="2020-07-23 (22)" src="https://user-images.githubusercontent.com/59122151/88258805-9a321180-ccde-11ea-8eb7-13dbb76cd101.png">
<img width="947" alt="2020-07-23 (23)" src="https://user-images.githubusercontent.com/59122151/88258808-9bfbd500-ccde-11ea-8f7d-10fb45f5c463.png">




# 2. A Search* (weighted)
Arguably the best pathfinding algorithm; uses heuristics to guarantee the shortest path much faster than Dijkstra's Algorithm , A* uses the same min-heap data structure that is implimented in Dijkstra's, but it expands upon Dijkstra's criteria for selecting the next node to explore. Dijkstra's chooses the node with the smallest distance from the starting node to be explored next. However, A* ranks nodes differently: it has a heuristic function that evaluates how far a node has traveled from the starting node <u>and</u> how far it is from the end node. This heuristic function makes the algorithm 'smart' since it is able to expand in a direction of interest. My implimentation of A* uses Euclidean distance for the end node distance calculation.


<img width="932" alt="2020-07-23 (2)" src="https://user-images.githubusercontent.com/59122151/88258304-75896a00-ccdd-11ea-90be-532ecbc05db5.png">
<img width="938" alt="2020-07-23 (26)" src="https://user-images.githubusercontent.com/59122151/88258300-74583d00-ccdd-11ea-8bc7-f61bd29731dd.png">





# 3. Greedy Best-first Search (weighted
A faster, more heuristic-heavy version of A*; does not  guarantee the shortest path tries to expand the node that is closest to the goal, on the grounds that this is likely to lead to a solution quickly. It evaluates nodes on a heuristic function, which in in this project is is the Euclidean distance from the current node to the end node. 

<img width="946" alt="2020-07-23 (24)" src="https://user-images.githubusercontent.com/59122151/88259138-525fba00-ccdf-11ea-885a-3ec78bcb6daf.png">
<img width="942" alt="2020-07-23 (28)" src="https://user-images.githubusercontent.com/59122151/88259130-512e8d00-ccdf-11ea-9116-300fc5b228c1.png">




# 4. Breath-first Search (unweighted)
A great algorithm , starts at the root node and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.; guarantees the shortest path

<img width="942" alt="2020-07-23 (25)" src="https://user-images.githubusercontent.com/59122151/88259886-e4b48d80-cce0-11ea-9a4d-93e4e2ef2db2.png">
<img width="942" alt="2020-07-23 (27)" src="https://user-images.githubusercontent.com/59122151/88259891-e5e5ba80-cce0-11ea-8ff1-c90f3258c5ee.png">


# 5. Depth-first Search (unweighted)
A very bad algorithm for pathfinding; does not guarantee the     shortest path, it starts at the root node and explores as far as possible along each branch before backtracking.



<img width="942" alt="2020-07-23 (28)" src="https://user-images.githubusercontent.com/59122151/88258925-e3826100-ccde-11ea-8d8a-78061b0cc213.png">
<img width="944" alt="2020-07-23 (29)" src="https://user-images.githubusercontent.com/59122151/88258919-e1b89d80-ccde-11ea-8a3e-7090e8d180da.png">


# 6. Bi-directional BFS 
Breath first search algorithm which searches bidirectionally, BI-BFS starts at the start node and end node both explores all of their neighbor nodes at the present depth prior to moving on to the nodes at the next depth level, it is same as BFS but it just travells both ways.


<img width="942" alt="2020-07-23 (14)" src="https://user-images.githubusercontent.com/59122151/88259803-aae38700-cce0-11ea-9689-9985a2aa94f5.png">
<img width="942" alt="2020-07-23 (38)" src="https://user-images.githubusercontent.com/59122151/88259799-a919c380-cce0-11ea-9f76-f28dd2c8bf61.png">


# 7. Jump Point search 
Jump point search (JPS) is an optimization to the A* search algorithm for uniform-cost grids .Jump Point Search is an optimization of A* for uniform cost grids. It reduces symmertries in the search procedure by graph pruning, which eliminates certain nodes to explore based on the assumptions that can be made about the current node's neighbors (as long as certain conditions are satisfied). My implimentation only considers straight horizontal and vertical 'jumps.' In the original JPS paper, it also considers diagonal jumps, but since my program only moves horizontally and vertically, I decided to not impliment diagonal jumps. This made the algorithm non-optimal, sometimes resulting in the algorithm not being able to find the end node. Despite this, I decided to leave this algorithm in myPath to demonstrate the different types of algorithms out there. 

<img width="949" alt="2020-07-23 (37)" src="https://user-images.githubusercontent.com/59122151/88259383-d31eb600-ccdf-11ea-8750-dfdc94b3bb7e.png">
<img width="944" alt="2020-07-23 (35)" src="https://user-images.githubusercontent.com/59122151/88259386-d4e87980-ccdf-11ea-943c-64f33ca5b9fc.png">


# 8. Travelling Salesman 
It gives shortest possible route that visits every city/Node exactly once Given a set of Nodes and distance between every pair of Node. It is calling the algorithm A* for finding the shortest path between 2 immediate points , it is breaking the problem into sub problems and finding the shortest path between the 2 nearest nodes. Note the difference between Hamiltonian Cycle and Travelling salesman. The Hamiltoninan cycle problem is to find if there exist a tour that visits every city exactly once. Here we know that Hamiltonian Tour exists (because the graph is complete) and in fact many such tours exist, the problem is to find a minimum weight Hamiltonian Cycle.

![WhatsApp Image 2020-07-24 at 11 33 44 PM](https://user-images.githubusercontent.com/51260237/88421663-90a3c900-ce06-11ea-97d7-8ce59c0dcee3.jpeg)







# MAZES

There are the following mazes :-

1. Random (recursive backtracking)
2. Recursive Division
3. Recursive Division (horizontal skew)
4. Recursive Division (vertical skew)
5. Simple Spiral
6. High Meteorite Hit Region

All the mazes are implemented using recursion and bactracking

# UNIQUE FACTORS

# 1. HIGH METEORITE HIT REGION 
Meteorite hit is very usual on planets like mars . The meteorite hit region is high risk region so our rover must avoid travelling through that region . It needs to decide to travel through such a path which might not be the shortest but contains least amount of hits in its way as our ultimate goal is to find the shortest path so it might have to face certain amount of risks. 

# 2. WATER
The most important thing required for human settlement on mars is WATER. So, if our rover finds the presence of water on mars  prioritizing the need of water it travles through  water even if it may not provide the shortest path between our start node and end node. 


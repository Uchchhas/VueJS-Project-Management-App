<template>
    <div>
        <div class="page-intro-wrapper">
            <div class="project-users">
                <div class="user-group">
                    <template v-for="(user, index) in users">
                        <img v-if="user.img_url && index < 3"
                             :src="user.img_url"
                             class="user-avatar"
                             :alt="user.name">
                        <div v-if="!user.img_url && index < 3" class="no-img">
                            {{ getNameInitial(user.name) }}
                        </div>
                    </template>
                    <div v-if="users.length > 3" class="more-user" @click="openUsersModal">
                        {{ users.length - 3 }}+
                    </div>
                </div>
                <button type="button" class="btn-invite">
                    <i class="bi bi-person-plus"></i> Invite People
                </button>
            </div>
            <div class="project-labels">
                <div class="label">
                    <span class="label-dot important"/>
                    <h4 class="label-title">Important</h4>
                </div>
                <div class="label">
                    <span class="label-dot irrelevant"/>
                    <h4 class="label-title">Irrelevant</h4>
                </div>
                <div class="label">
                    <span class="label-dot default"/>
                    <h4 class="label-title">Default</h4>
                </div>
            </div>
        </div>
        
        <div class="kanban-wrapper">
            <div class="draggable-wrapper">
                <template v-if="projects" v-for="(projectState, index) in projects.states">
                    <div class="draggable-column">
                        <div class="column-header">
                            <div class="column-title">
                                {{ projectState.name }}
                                <span class="column-items-number">
                                    ( {{ projectState.stateItems.length }} )
                                </span>
                            </div>
                            <button v-if="projectState.type !== 'done'"
                                    type="button"
                                    class="btn-add-task"
                                    @click="openTaskModal(projectState.type)">
                                <i class="bi bi-plus"></i> New Task
                            </button>
                        </div>
                        <draggable class="draggable-area"
                                   :list="projectState.stateItems"
                                   :animation="200"
                                   ghost-class="ghost-card"
                                   group="projects"
                                   @change="changeStage"
                                   :itemKey="projectState.name">
                            <template #item="{element, index}">
                                <div class="project-card">
                                    <div class="label">
                                        <span :class="`label-dot ${element.project_type}`"/>
                                        <h4 class="label-title">{{ element.title }}</h4>
                                    </div>
                                    <p class="description">{{ element.description }}</p>
                                    <div class="card-footer">
                                        <div class="user-group">
                                            <template v-for="(user, index) in findUser(element.assignedUsers)">
                                                <img v-if="user.img_url && index < 3"
                                                     :src="user.img_url"
                                                     class="user-avatar"
                                                     :alt="user.name">
                                                <div v-if="!user.img_url && index < 3" class="no-img">
                                                    {{ getNameInitial(user.name) }}
                                                </div>
                                            </template>
                                            <div v-if="element.assignedUsers.length > 3"
                                                 class="more-user"
                                                 @click="openUsersModal">
                                                {{ element.assignedUsers.length - 3 }}+
                                            </div>
                                        </div>
                                        <div class="dropdown dropdown-action">
                                            <button type="button" @click="openDropdown(`project_action_${element.id}`)">
                                                <i class="bi bi-three-dots"/>
                                            </button>
                                            <div :id="`project_action_${element.id}`" class="dropdown-content">
                                                <a href="#" @click.prevent="editTask(element.id, projectState.type)">Edit</a>
                                                <a href="#" @click.prevent="deleteTask(element.id, projectState.type)">Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </draggable>
                        <div v-if="!projectState.stateItems.length" class="empty-column">
                            <img src="../assets/img/no_data.svg" alt="No task">
                            <p>This pipeline is empty!</p>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        
        <!-- Users Modal -->
        <div id="usersModal" class="modal users-modal">
            <div class="modal-content">
                <button type="button" class="close" @click="closeUsersModal">
                    <i class="bi bi-x"/>
                </button>
                <div class="modal-header">
                    <h2 class="modal-title">Users</h2>
                </div>
                <div class="modal-body">
                    <div class="invited-users">
                        <div class="user-media" v-for="(user, index) in users">
                            <img v-if="user.img_url" :src="user.img_url" :alt="user.name">
                            <div v-else class="no-img">{{ getNameInitial(user.name) }}</div>
                            <p class="user-name">{{ user.name }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Task Modal -->
        <div id="taskModal" class="modal task-modal">
            <div class="modal-content">
                <button type="button" class="close" @click="closeTaskModal">
                    <i class="bi bi-x"/>
                </button>
                <div class="modal-header">
                    <h2 class="modal-title">Create New Task</h2>
                </div>
                <div class="modal-body">
                    <div class="tab">
                        <ul class="tab-header">
                            <li class="tab-menu-item"
                                @click="selectTab(1)"
                                :class="{active: activeTab === 1}">
                                General Info
                            </li>
                            <li class="tab-menu-item"
                                @click="selectTab(2)"
                                :class="{active: activeTab === 2}">
                                Assigned To
                            </li>
                        </ul>
                        <div class="tab-content">
                            <ul class="tab-list" ref="tabsList">
                                <li class="tab-list-item" :class="{active: activeTab === 1}">
                                    <div class="form-group">
                                        <label for="title">Title</label>
                                        <input type="text"
                                               id="title"
                                               class="form-control"
                                               placeholder="Enter task title"
                                               v-model="formData.title">
                                    </div>
                                    <div class="form-group">
                                        <label for="description">Description</label>
                                        <textarea
                                            id="description"
                                            class="form-control"
                                            rows="5" v-model="formData.description"/>
                                    </div>
                                    <div class="form-group">
                                        <label for="projectType">Project Type</label>
                                        <select id="projectType" class="form-control" v-model="formData.type">
                                            <option value="important">Important</option>
                                            <option value="irrelevant">Irrelevant</option>
                                            <option value="default">Default</option>
                                        </select>
                                    </div>
                                </li>
                                <li class="tab-list-item" :class="{active: activeTab === 2}">
                                    <div class="form-group search-employee">
                                        <div class="input-group">
                                            <input type="search"
                                                   class="form-control"
                                                   placeholder="Search employee"
                                                   v-model="searchEmployee">
                                            <i class="bi bi-search"></i>
                                        </div>
                                        <ul v-if="searchEmployee" class="autocomplete-wrapper">
                                            <li v-for="(user, index) in filteredUser" :value="user.name"
                                                @click="assignUser(user.id)">
                                                {{ user.name }}
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="employees-wrapper">
                                        <div class="employee" v-for="(user, index) in findUser(formData.assignedUsers)">
                                            <div class="user-media">
                                                <img v-if="user.img_url" :src="user.img_url" :alt="user.name">
                                                <div v-else class="no-img">{{ getNameInitial(user.name) }}</div>
                                                <p class="user-name">{{ user.name }}</p>
                                            </div>
                                            <button type="button" class="btn-remove" @click="removeEmployee(user.id)">
                                                <i class="bi bi-x"/>
                                            </button>
                                        </div>
                                        <div v-if="!formData.assignedUsers.length" class="not-assigned-users">
                                            <h3>No employees assigned yet</h3>
                                            <p>Search in the input box to assign employee</p>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <button type="submit" class="btn-save" @click="addTask">
                        Save
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';
    import {mapGetters, mapState} from 'vuex';
    import draggable from 'vuedraggable';
    
    export default {
        name: 'Projects',
        components: {draggable},
        data() {
            return {
                users: [
                    {
                        id: 1,
                        name: 'Yvone Stocking',
                        img_url: 'https://images.unsplash.com/photo-1485893086445-ed75865251e0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                    },
                    {id: 2, name: 'Kerrie Kissner', img_url: ''},
                    {
                        id: 3,
                        name: 'Frida Curd',
                        img_url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                    },
                    {
                        id: 4,
                        name: 'Thomasina Westhoff',
                        img_url: 'https://images.unsplash.com/photo-1529068755536-a5ade0dcb4e8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                    },
                    {
                        id: 5,
                        name: 'Jeanene Smale',
                        img_url: 'https://images.unsplash.com/photo-1499887142886-791eca5918cd?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                    },
                    {
                        id: 6,
                        name: 'Jocelyn Cullinan',
                        img_url: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                    },
                    {
                        id: 7,
                        name: 'Eveline Schewe',
                        img_url: 'https://images.unsplash.com/photo-1497340525489-441e8427c980?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                    },
                    {
                        id: 8,
                        name: 'Carlene Denn',
                        img_url: 'https://images.unsplash.com/photo-1484186304838-0bf1a8cff81c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHBlb3BsZXxlbnwwfDJ8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                    },
                    {
                        id: 9,
                        name: 'Bok Partlow',
                        img_url: 'https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fHBlb3BsZXxlbnwwfDJ8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                    },
                    {
                        id: 10,
                        name: 'Lasandra Claussen',
                        img_url: 'https://images.unsplash.com/photo-1484611941511-3628849e90f7?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTl8fHBlb3BsZXxlbnwwfDJ8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                    },
                    {
                        id: 11,
                        name: 'Elida Mabry',
                        img_url: 'https://images.unsplash.com/photo-1484186139897-d5fc6b908812?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHBlb3BsZXxlbnwwfDJ8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                    },
                    {
                        id: 12,
                        name: 'Laverna Versace',
                        img_url: 'https://images.unsplash.com/photo-1485528562718-2ae1c8419ae2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjR8fHBlb3BsZXxlbnwwfDJ8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                    },
                    {
                        id: 13,
                        name: 'Jackie Cruz',
                        img_url: 'https://images.unsplash.com/photo-1485893226355-9a1c32a0c81e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjV8fHBlb3BsZXxlbnwwfDJ8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                    },
                    {
                        id: 14,
                        name: 'Tomi Baldonado',
                        img_url: 'https://images.unsplash.com/photo-1470071131384-001b85755536?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjl8fHBlb3BsZXxlbnwwfDJ8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                    },
                    {
                        id: 15,
                        name: 'Bettie Thornsberry',
                        img_url: 'https://images.unsplash.com/photo-1518577915332-c2a19f149a75?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDB8fHBlb3BsZXxlbnwwfDJ8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                    },
                    {
                        id: 16,
                        name: 'Mariela Sumler',
                        img_url: 'https://images.unsplash.com/photo-1508473161895-5dabcc2f59cf?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDd8fHBlb3BsZXxlbnwwfDJ8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                    },
                    {id: 17, name: 'Jacalyn Passarelli', img_url: ''},
                    {id: 18, name: 'Martina Borton', img_url: ''},
                    {id: 19, name: 'Jonnie Grate', img_url: ''},
                    {id: 20, name: 'Rochelle Bechtold'},
                ],
                demoData: {
                    states: [
                        {
                            name: 'To do',
                            type: 'todo',
                            stateItems: [
                                {
                                    id: 1,
                                    title: 'Design',
                                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                                    project_type: 'irrelevant',
                                    assignedUsers: [1, 2, 3]
                                },
                                {
                                    id: 2,
                                    title: 'Illustration',
                                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                                    project_type: 'important',
                                    assignedUsers: [3, 2, 4]
                                }
                            ]
                        },
                        {
                            name: 'In Progress',
                            type: 'in_progress',
                            stateItems: [
                                {
                                    id: 3,
                                    title: 'Design',
                                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                                    project_type: 'irrelevant',
                                    assignedUsers: [3, 2, 4]
                                },
                                {
                                    id: 4,
                                    title: 'Prototype',
                                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                                    project_type: 'default',
                                    assignedUsers: []
                                }
                            ]
                        },
                        {
                            name: 'Done',
                            type: 'done',
                            stateItems: [
                                {
                                    id: 5,
                                    title: 'Moodboard',
                                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                                    project_type: 'irrelevant',
                                    assignedUsers: []
                                }
                            ]
                        }
                    ]
                },
                formData: {
                    title: '',
                    description: '',
                    type: '',
                    assignedUsers: []
                },
                activeTab: 1,
                offsetRight: 0,
                projectState: '',
                searchEmployee: ''
            }
        },
        computed: {
            // Getting projects state from vuex store
            ...mapGetters(['projects']),
            
            // Return filtered users in employee assignment
            filteredUser() {
                return this.users.filter(item => item.name.toLowerCase().includes(this.searchEmployee.toLowerCase()));
            }
        },
        methods: {
            // Initiate local storage when the app mount
            initiateLocalStorage() {
                let storage = localStorage.getItem('stages');
                if (storage) {
                    this.$store.commit('getProject', JSON.parse(storage))
                } else {
                    localStorage.setItem('stages', JSON.stringify(this.demoData));
                    this.$store.commit('getProject', this.demoData)
                }
            },
            
            // Update local storage after every action
            updateLocalStorage() {
                localStorage.setItem('stages', JSON.stringify(this.projects));
            },
            
            // Get name initial if the employee has no image
            getNameInitial(name) {
                const fullName = name.split(' ');
                const initials = fullName.shift().charAt(0) + fullName.pop().charAt(0);
                return initials.toUpperCase();
            },
            
            // Generate unique id for any specific task
            generateUniqueId() {
                let ids = [];
                this.projects.states.forEach(item => {
                    ids = ids.concat(item.stateItems.map(i => Number(i.id)))
                });
                
                return Math.max(...ids) + 1
            },
            
            // Returns filtered users with ids
            findUser(users) {
                return this.users.filter(item => users.includes(item.id));
            },
            
            // Opening dropdown menu
            openDropdown(id) {
                document.getElementById(id).classList.toggle('show');
            },
            
            // Closing dropdown menu
            closeDropdown() {
                let element = document.querySelector('.draggable-wrapper');
                element.querySelectorAll('.dropdown-content.show').forEach(obj => obj.classList.remove('show'));
            },
            
            // Switching tab in task assignment modal
            selectTab(id) {
                let tabsList = this.$refs.tabsList;
                this.activeTab = id;
                this.offsetRight = tabsList.clientWidth * (id - 1);
                tabsList.style.right = this.offsetRight + 'px';
            },
            
            // Assigning user to a task
            assignUser(id) {
                this.formData.assignedUsers.push(id);
                this.searchEmployee = '';
            },
            
            // Opening employees modal
            openUsersModal() {
                document.getElementById('usersModal').classList.add('show');
            },
            
            // Closing employees modal
            closeUsersModal() {
                document.getElementById('usersModal').classList.remove('show')
            },
            
            // Opening task modal
            openTaskModal(type) {
                document.getElementById('taskModal').classList.add('show');
                this.projectState = type;
            },
            
            // Closing task modal
            closeTaskModal() {
                document.getElementById('taskModal').classList.remove('show');
                this.formData = {
                    title: '',
                    description: '',
                    type: '',
                    assignedUsers: []
                }
            },
            
            // For add or update task
            addTask() {
                let state = this.projects.states.find((item) => item.type === this.projectState);
                if (this.formData.id) {
                    let task = state.stateItems.find((item) => item.id === this.formData.id);
                    task.title = this.formData.title;
                    task.description = this.formData.description;
                    task.type = this.formData.type;
                    task.assignedUsers = this.formData.assignedUsers;
                } else {
                    state.stateItems.push({
                        id: this.generateUniqueId(),
                        title: this.formData.title,
                        description: this.formData.description,
                        project_type: this.formData.type,
                        assignedUsers: this.formData.assignedUsers
                    });
                }
                this.updateLocalStorage();
                this.closeTaskModal();
            },
            
            // Edit task
            editTask(id, type) {
                let state = this.projects.states.find((item) => item.type === type),
                    task = state.stateItems.find((item) => item.id === id);
                
                this.formData = _.cloneDeep(task);
                this.openTaskModal(type);
                this.closeDropdown();
            },
            
            // For deleting task
            deleteTask(id, type) {
                let state = this.projects.states.find((item) => item.type === type),
                    tasks = state.stateItems.map(item => item.id),
                    index = tasks.indexOf(id)
                
                state.stateItems.splice(index, 1);
                this.updateLocalStorage();
                this.closeDropdown();
            },
            
            // Remove employee from a task
            removeEmployee(id) {
                this.formData.assignedUsers.splice(this.formData.assignedUsers.indexOf(id), 1);
            },
            
            // On changing Draggable state
            changeStage(e) {
                this.updateLocalStorage();
            },
        },
        mounted() {
            // Initiating local storage
            this.initiateLocalStorage();
            
            // Closing modals on outside click
            let userModal = document.getElementById('usersModal'),
                taskModal = document.getElementById('taskModal');
            window.onclick = function (event) {
                if (event.target == userModal) {
                    userModal.classList.remove('show');
                }
                if (event.target == taskModal) {
                    taskModal.classList.remove('show');
                }
            }
            
            // Animate tab content
            let tabsList = this.$refs.tabsList;
            tabsList.style.right = this.offsetRight + 'px';
        },
    }
</script>
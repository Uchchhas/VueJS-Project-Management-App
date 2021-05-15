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
                <template v-for="(projectState, index) in projects.states">
                    <div class="draggable-column">
                        <div class="column-header">
                            <div class="column-title">
                                {{ projectState.name }}
                                <span class="column-items-number">
                                    ( {{ projectState.stateItems.length }} )
                                </span>
                            </div>
                            <button type="button" class="btn-add-task" @click="openTaskModal">
                                <i class="bi bi-plus"></i> New Task
                            </button>
                        </div>
                        <draggable :list="projectState.stateItems"
                                   :animation="200"
                                   ghost-class="ghost-card"
                                   group="projects"
                                   @change="log"
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
                                            <template v-for="(user, index) in element.assignedUsers">
                                                <img v-if="user.img_url && index < 3"
                                                     :src="user.img_url"
                                                     class="user-avatar"
                                                     :alt="user.name">
                                                <div v-if="!user.img_url && index < 3" class="no-img">
                                                    {{ getNameInitial(user.name) }}
                                                </div>
                                            </template>
                                            <div v-if="element.assignedUsers > 3" class="more-user"
                                                 @click="openUsersModal">
                                                {{ users.length - 3 }}+
                                            </div>
                                        </div>
                                        <div class="dropdown dropdown-action">
                                            <button type="button" @click="openDropdown(`project_action_${element.id}`)">
                                                <i class="bi bi-three-dots"/>
                                            </button>
                                            <div :id="`project_action_${element.id}`" class="dropdown-content">
                                                <a href="#">Edit</a>
                                                <a href="#">Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </draggable>
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
                                        <input type="text" id="title" class="form-control" placeholder="Enter task title">
                                    </div>
                                    <div class="form-group">
                                        <label for="description">Description</label>
                                        <textarea id="description" class="form-control" rows="5"></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label for="projectType">Project Type</label>
                                        <select id="projectType" class="form-control">
                                            <option value="important">Important</option>
                                            <option value="irrelevant">Irrelevant</option>
                                            <option value="default">Default</option>
                                        </select>
                                    </div>
                                </li>
                                <li class="tab-list-item" :class="{active: activeTab === 2}">
                                    <div class="form-group search-employee">
                                        <input type="search" class="form-control" placeholder="Search Employees">
                                    </div>
                                    <div class="employees-wrapper">
                                        <div class="employee" v-for="(user, index) in users">
                                            <div class="user-media">
                                                <img v-if="user.img_url" :src="user.img_url" :alt="user.name">
                                                <div v-else class="no-img">{{ getNameInitial(user.name) }}</div>
                                                <p class="user-name">{{ user.name }}</p>
                                            </div>
                                            <button type="button" class="btn-remove" @click="removeEmployee(id)">
                                                <i class="bi bi-x"/>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <button type="submit" class="btn-save">
                        Save
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import draggable from "vuedraggable";
    
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
                projects: {
                    states: [
                        {
                            name: 'To do',
                            stateItems: [
                                {
                                    id: 1,
                                    title: 'Design',
                                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                                    project_type: 'irrelevant',
                                    assignedUsers: [
                                        {
                                            id: 1,
                                            name: 'Yvone Stocking',
                                            img_url: 'https://images.unsplash.com/photo-1485893086445-ed75865251e0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                        },
                                        {
                                            id: 2,
                                            name: 'Kerrie Kissner',
                                            img_url: ''
                                        },
                                        {
                                            id: 3,
                                            name: 'Frida Curd',
                                            img_url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                        }
                                    ]
                                },
                                {
                                    id: 2,
                                    title: 'Illustration',
                                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                                    project_type: 'important',
                                    assignedUsers: [
                                        {
                                            id: 1,
                                            name: 'Yvone Stocking',
                                            img_url: 'https://images.unsplash.com/photo-1485893086445-ed75865251e0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                        },
                                        {
                                            id: 2,
                                            name: 'Kerrie Kissner',
                                            img_url: ''
                                        },
                                        {
                                            id: 3,
                                            name: 'Frida Curd',
                                            img_url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                        }
                                    ]
                                },
                                {
                                    id: 3,
                                    title: 'Prototype',
                                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                                    project_type: 'default',
                                    assignedUsers: [
                                        {
                                            id: 1,
                                            name: 'Yvone Stocking',
                                            img_url: 'https://images.unsplash.com/photo-1485893086445-ed75865251e0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                        },
                                        {
                                            id: 2,
                                            name: 'Kerrie Kissner',
                                            img_url: ''
                                        },
                                        {
                                            id: 3,
                                            name: 'Frida Curd',
                                            img_url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            name: 'In Progress',
                            stateItems: [
                                {
                                    id: 4,
                                    title: 'Design',
                                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                                    project_type: 'irrelevant',
                                    assignedUsers: [
                                        {
                                            id: 1,
                                            name: 'Yvone Stocking',
                                            img_url: 'https://images.unsplash.com/photo-1485893086445-ed75865251e0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                        },
                                        {
                                            id: 2,
                                            name: 'Kerrie Kissner',
                                            img_url: ''
                                        },
                                        {
                                            id: 3,
                                            name: 'Frida Curd',
                                            img_url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                        }
                                    ]
                                },
                                {
                                    id: 5,
                                    title: 'Prototype',
                                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                                    project_type: 'default',
                                    assignedUsers: [
                                        {
                                            id: 1,
                                            name: 'Yvone Stocking',
                                            img_url: 'https://images.unsplash.com/photo-1485893086445-ed75865251e0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                        },
                                        {
                                            id: 2,
                                            name: 'Kerrie Kissner',
                                            img_url: ''
                                        },
                                        {
                                            id: 3,
                                            name: 'Frida Curd',
                                            img_url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            name: 'Done',
                            stateItems: [
                                {
                                    id: 6,
                                    title: 'Moodboard',
                                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                                    project_type: 'irrelevant',
                                    assignedUsers: [
                                        {
                                            id: 1,
                                            name: 'Yvone Stocking',
                                            img_url: 'https://images.unsplash.com/photo-1485893086445-ed75865251e0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                        },
                                        {
                                            id: 2,
                                            name: 'Kerrie Kissner',
                                            img_url: ''
                                        },
                                        {
                                            id: 3,
                                            name: 'Frida Curd',
                                            img_url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                        }
                                    ]
                                },
                                {
                                    id: 7,
                                    title: 'Website',
                                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                                    project_type: 'important',
                                    assignedUsers: [
                                        {
                                            id: 1,
                                            name: 'Yvone Stocking',
                                            img_url: 'https://images.unsplash.com/photo-1485893086445-ed75865251e0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                        },
                                        {
                                            id: 2,
                                            name: 'Kerrie Kissner',
                                            img_url: ''
                                        },
                                        {
                                            id: 3,
                                            name: 'Frida Curd',
                                            img_url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                        }
                                    ]
                                },
                                {
                                    id: 8,
                                    title: 'Design',
                                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                                    project_type: 'default',
                                    assignedUsers: [
                                        {
                                            id: 1,
                                            name: 'Yvone Stocking',
                                            img_url: 'https://images.unsplash.com/photo-1485893086445-ed75865251e0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                        },
                                        {
                                            id: 2,
                                            name: 'Kerrie Kissner',
                                            img_url: ''
                                        },
                                        {
                                            id: 3,
                                            name: 'Frida Curd',
                                            img_url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                
                activeTab: 1,
                offsetRight: 0,
            }
        },
        methods: {
            openUsersModal() {
                document.getElementById('usersModal').classList.add('show');
            },
            closeUsersModal() {
                document.getElementById('usersModal').classList.remove('show')
            },
            openTaskModal() {
                document.getElementById('taskModal').classList.add('show');
            },
            closeTaskModal() {
                document.getElementById('taskModal').classList.remove('show')
            },
            getNameInitial(name) {
                const fullName = name.split(' ');
                const initials = fullName.shift().charAt(0) + fullName.pop().charAt(0);
                return initials.toUpperCase();
            },
            openDropdown(id) {
                document.getElementById(id).classList.toggle('show');
            },
            removeEmployee(id) {
            
            },
            selectTab(id) {
                let tabsList = this.$refs.tabsList;
                this.activeTab = id;
                this.offsetRight = tabsList.clientWidth * (id - 1);
                tabsList.style.right = this.offsetRight + 'px';
            },
            
            // Draggable States
            clone(el) {
                return {
                    name: el.name + " cloned"
                };
            },
            log(evt) {
                window.console.log(evt);
            },
        },
        mounted() {
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
        }
    }
</script>
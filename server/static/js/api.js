// 配置axios基础URL
axios.defaults.baseURL = 'http://192.168.10.51:3000';

const API = {
    // 服务管理
    server: {
        start: () => axios.get('/api/verdaccio/start'),
        stop: () => axios.get('/api/verdaccio/stop'),
        restart: () => axios.get('/api/verdaccio/restart')
    },

    // 用户管理
    user: {
        search: (keyword) => axios.get(`/api/users/search?keyword=${keyword || ''}`),
        delete: (username) => axios.delete(`/api/users/${encodeURIComponent(username)}`),
        update: (username, data) => axios.put(`/api/users/${encodeURIComponent(username)}`, data),
        updateGroups: (username, groups) => axios.put(`/api/users/${encodeURIComponent(username)}/groups`, { groups })
    },

    // 组管理
    group: {
        search: (keyword) => axios.get(`/api/groups/search?keyword=${keyword || ''}`),
        create: (data) => axios.post('/api/groups', data),
        delete: (name) => axios.delete(`/api/groups/${encodeURIComponent(name)}`),
        getMembers: (name) => axios.get(`/api/groups/${encodeURIComponent(name)}/members`)
    },

    // 包权限管理
    package: {
        search: (keyword) => axios.get(`/api/packages/search?keyword=${keyword || ''}`),
        create: (data) => axios.post('/api/packages', data),
        delete: (name) => axios.delete(`/api/packages/${encodeURIComponent(name)}`),
        update: (name, data) => axios.put(`/api/packages/${encodeURIComponent(name)}`, data)
    }
}; 
<template>
    <div class="container ">
        <div class="row justify-content-center" v-if="$gate.isAdminORisAuthor()">
            <div class="col-md-12">
                <div class="card"  >

                    <div class="card-header ">
                        <h3 class="d-inline">User Table</h3>
                        <button class="btn-sm btn-success btn float-right"  @click="addUserModel">
                            Add new
                            <i class="fa fa-user-plus"></i>
                        </button>
                    </div>

                    <div class="card-body">
                       <table class="table">
                           <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Type</th>
                                    <th>Registered at</th>
                                    <th>Modify</th>
                                </tr>
                           </thead>
                           <tbody>
                                <tr v-for="user of users.data" :key="user.id">
                                    <td>{{user.id}}</td>
                                    <td>{{user.name}}</td>
                                    <td>{{user.email}}</td>
                                    <td>{{user.rule | capitalize}}</td>
                                    <td>{{user.created_at | myDate}}</td>
                                    <td>
                                        <a href="#" @click="updateInfoModel(user)"> <i class="fa fa-pen green"></i></a>
                                        <b class="h4">/</b>
                                        <a href="#" @click="deleteUser(user.id)"><i class="fa fa-trash red"></i></a>
                                    </td>
                                </tr>
                           </tbody>
                       </table>

                        <pagination class="mt-3" :data="users" @pagination-change-page="getResults">
                            <span slot="prev-nav">Previous</span>
                            <span slot="next-nav">Next </span>
                        </pagination>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="!$gate.isAdminORisAuthor()">
            <not-found></not-found>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="AddUser" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <form @submit.prevent="show ? updateInfo():createUser()" @keydown="form.onKeydown($event)">
                    <div class="modal-header">
                         <h5 v-show="!show" class="modal-title" id="exampleModalLongTitle">Add User</h5>
                         <h5 v-show="show" class="modal-title" id="exampleModalLongTitle">Update Information</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">

                            <div class="form-group">
                                <input v-model="form.name" type="text" name="name"
                                       placeholder="UserName"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                                <has-error :form="form" field="name"></has-error>
                            </div>

                            <div class="form-group">
                                <input v-model="form.email" type="text" name="email"
                                       placeholder="Email"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                                <has-error :form="form" field="email"></has-error>
                            </div>

                            <div class="form-group">
                                <input v-model="form.password" type="password" name="password"
                                       placeholder="Password"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                                <has-error :form="form" field="password"></has-error>
                            </div>

                            <div class="form-group">
                                <select name="rule" id="rule" v-model="form.rule" class="form-control" :class="{ 'is-invalid': form.errors.has('rule')}" >
                                    <option value="">Select Rule</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                    <option value="author">Author</option>
                                </select>
                                <has-error :form="form" field="rule"></has-error>
                            </div>

                            <div class="form-group">
                                <textarea name="bio" id="" v-model="form.bio" class="form-control" :class="{ 'is-invalid': form.errors.has('bio')}" >
                                    Enter Your Bio
                                </textarea>
                                <has-error :form="form" field="bio"></has-error>
                            </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button v-show="show" type="submit" class="btn btn-primary">Update</button>
                        <button v-show="!show" type="submit" class="btn btn-primary">Submit</button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {

        data(){
            return{
                'show':true,

                'users':{},
                form:new Form({
                    id: '',
                    name: '',
                    email: '',
                    bio: '',
                    rule: '',
                    password: '',
                })
            }
        },
        methods:{
            getResults(page = 1)
            {
                axios.get('api/user?page=' + page)
                    .then(response => {
                        this.users = response.data;
                    });
            },

            addUserModel(){
                $('#AddUser').modal('show');
                this.show = false;
                this.form.reset ();
            },

            updateInfoModel(data){
                $('#AddUser').modal('show');
                this.show = true;
                this.form.fill(data);
            },

            updateInfo(){
                this.$Progress.start();
                this.form.put('api/user/'+ this.form.id)
                    .then(response=>{
                        //success
                        $('#AddUser').modal('hide');
                        Toast.fire({
                            icon: 'success',
                            title: 'Updated in successfully'
                        });
                        this.$Progress.finish()
                        Fire.$emit('refreshData');
                    })
                    .catch(error=>{

                    })
            },

            deleteUser(id){
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.value) {
                        this.form.delete('api/user/'+id).then(response=>{
                            this.$Progress.start();
                            Swal.fire(
                                'Deleted!',
                                'Your file has been deleted.',
                                'success'
                            );
                            Fire.$emit('refreshData');
                            this.$Progress.finish()
                        })
                    }
                })
            },

            createUser(){
                this.$Progress.start();
                this.form.post('api/user').
                then(response=>{

                        $('#AddUser').modal('hide');
                        Toast.fire({
                            icon: 'success',
                            title: 'Created in successfully'
                        });
                        this.$Progress.finish()
                        Fire.$emit('refreshData');
                    }
                ).catch(error=>{
                    this.$Progress.fail();
                });
            },

            loadUser(){
                if(this.$gate.isAdminORisAuthor()){
                    axios.get('api/user').then(response=>{
                        this.users = response.data;
                    });
                }
            }
        },
        mounted() {
            Fire.$on('searchData',()=>{
                const query = this.$parent.keyword;
                axios.get('api/searching?q='+query)
                    .then(response=>{
                        this.users = response.data
                    })
                    .catch(()=>{

                    })
            });

            this.loadUser();
            Fire.$on(
                'refreshData',()=>{
                    this.loadUser();
                });
            /*setInterval(()=>this.loadUser(),3000);*/
            console.log('Component mounted.')
        }
    }
</script>

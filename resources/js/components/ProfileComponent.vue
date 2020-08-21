<style>
    .widget-user-header{
        height: 250px!important;
    }

    .widget-user .widget-user-image {
        top: 140px;
    }

    .widget-user .widget-user-image > img {
        width: 150px;
    }
</style>

<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12">
                <!-- Widget: user widget style 1 -->
                <div class="card card-widget widget-user">
                    <!-- Add the bg color to the header using any of the bg-* classes -->
                    <div class="widget-user-header text-white" style="background: url('img/bg.jpg') center center;">
                        <h3 class="widget-user-username text-right">Elizabeth Pierce</h3>
                        <h5 class="widget-user-desc text-right">Web Designer</h5>
                    </div>
                    <div class="widget-user-image">
                        <img class="img-circle" :src="getProfileAvatar()" alt="User Avatar">
                    </div>
                    <div class="card-footer">
                        <div class="row">
                            <div class="col-sm-4 border-right">
                                <div class="description-block">
                                    <h5 class="description-header">3,200</h5>
                                    <span class="description-text">SALES</span>
                                </div>
                                <!-- /.description-block -->
                            </div>
                            <!-- /.col -->
                            <div class="col-sm-4 border-right">
                                <div class="description-block">
                                    <h5 class="description-header">13,000</h5>
                                    <span class="description-text">FOLLOWERS</span>
                                </div>
                                <!-- /.description-block -->
                            </div>
                            <!-- /.col -->
                            <div class="col-sm-4">
                                <div class="description-block">
                                    <h5 class="description-header">35</h5>
                                    <span class="description-text">PRODUCTS</span>
                                </div>
                                <!-- /.description-block -->
                            </div>
                            <!-- /.col -->
                        </div>
                        <!-- /.row -->
                    </div>
                </div>
                <!-- /.widget-user -->
            </div>
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header p-2">
                        <ul class="nav nav-pills">
                            <li class="nav-item"><a class="nav-link active show" href="#activity" data-toggle="tab">Activity</a></li>
                            <li class="nav-item"><a class="nav-link" href="#settings" data-toggle="tab">Settings</a></li>
                        </ul>
                    </div><!-- /.card-header -->
                    <div class="card-body">
                        <div class="tab-content">
                            <div class="tab-pane active show" id="activity">

                            </div>

                            <div class="tab-pane" id="settings">
                                <form class="form-horizontal">
                                    <div class="form-group">
                                        <label  for="inputName" class="col-sm-2 control-label">Name</label>

                                        <div class="col-sm-10">
                                            <input v-model="form.name" type="text" class="form-control" id="inputName" placeholder="Name" :class="{ 'is-invalid': form.errors.has('name') }">
                                            <has-error :form="form" field="name"></has-error>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="inputEmail" class="col-sm-2 control-label">Email</label>

                                        <div class="col-sm-10">
                                            <input v-model="form.email" type="email" class="form-control" id="inputEmail" placeholder="Email" :class="{ 'is-invalid': form.errors.has('email') }">
                                            <has-error :form="form" field="email"></has-error>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="password" class="col-sm-2 control-label">Password</label>

                                        <div class="col-sm-10">
                                            <input v-model="form.password"  type="password" class="form-control" id="password" name="password" placeholder="password" :class="{ 'is-invalid': form.errors.has('password') }">
                                            <has-error :form="form" field="password"></has-error>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="inputExperience" class="col-sm-2 control-label">Experience</label>

                                        <div class="col-sm-10">
                                            <textarea class="form-control"  name="experience" id="inputExperience" placeholder="Experience" :class="{ 'is-invalid': form.errors.has('experience') }"> </textarea>
                                            <has-error :form="form" field="experience"></has-error>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="avatar" class="col-sm-2 control-label">Photo</label>

                                        <div class="col-sm-10">
                                            <input @change="uploadPhoto" type="file" class="" id="avatar" name="avatar" >
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="col-sm-offset-2 col-sm-10">
                                            <button @click.prevent="updateProfile" class="btn btn-danger">Submit</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <!-- /.tab-pane -->
                        </div>
                        <!-- /.tab-content -->
                    </div><!-- /.card-body -->
                </div>
                <!-- /.nav-tabs-custom -->
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                form:new Form({
                id: '',
                name: '',
                email: '',
                bio: '',
                rule: '',
                password:'',
                avatar:'',

            })}
        },
        methods:{
            getProfileAvatar()
            {
                let prefix = (this.form.avatar.match(/\//) ? '' : '/img/profile/');
                return prefix + this.form.avatar;
            },

            updateProfile()
            {
                this.form.put('api/profile/')
                    .then(()=>{

                    })
                    .catch(()=>{

                    })
            },

            uploadPhoto(e)
            {
                const selectedAvatar =e.target.files[0];
                const reader = new FileReader();

                reader.onloadend = ()=>{
                    this.form.avatar = reader.result;
                };
                reader.readAsDataURL(selectedAvatar);

            }
        },
        mounted() {
            console.log('Component mounted.')
        },
        created(){
            axios.get('api/profile').then(response=>{
                this.form.fill(response.data)
            })
        }
    }
</script>

export default class Gate {
    constructor(user)
    {
        this.user=user;
    }

    isAdmin()
    {
        return this.user.rule === 'admin';
    }
    isUser()
    {
        return this.user.rule === 'user';
    }
    isCasual()
    {
        return this.user.rule === 'author';
    }
    isAdminORisAuthor(){
        if(this.user.rule==='author' || this.user.rule === 'admin'){
            return true;
        }
    }
}

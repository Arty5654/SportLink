class User {
    // subject to change


    // initializes user with just email and password from signu[]
    constructor(email, password) {
        this.email = email;

        //TODO add encryption for the database (bcrypt seems easy)
        this.password = password;
    }

    // adds new field to a user - username, agem etc.
    addField(fieldName, val) {
        this[fieldName] = val;
    }


}

export default User;
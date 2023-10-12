class User {
    // subject to change


    // initializes user with just email and password from signu[]
    constructor(email, username, firstName, lastName) {
        this.email = email;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone;
        this.location;
        this.age;
        this.gender;
        this.friends;
    }

    // adds new field to a user - username, age etc.
    addField(fieldName, val) {
        this[fieldName] = val;
    }


}

export default User;
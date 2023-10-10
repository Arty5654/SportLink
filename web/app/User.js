class User {
    // subject to change


    // initializes user with just email and password from signu[]
    constructor(email, username, location, age, phone) {
        this.email = email;
        this.username = username;

        this.location = location;
        this.age = age;
        this.phone = phone;
    }

    // adds new field to a user - username, age etc.
    addField(fieldName, val) {
        this[fieldName] = val;
    }


}

export default User;
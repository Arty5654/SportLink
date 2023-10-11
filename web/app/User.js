class User {
    // subject to change


    // initializes user with just email and password from signu[]
    constructor(email, username, name, phone, age, location) {
        this.email = email;
        this.username = username;
        this.name = name;
        this.phone = phone;
        this.location = location;
        this.age = age;

    }

    // adds new field to a user - username, age etc.
    addField(fieldName, val) {
        this[fieldName] = val;
    }


}

export default User;
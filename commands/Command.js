module.exports = class Command {
    constructor(name, description, args, usage, category){
        //simply store with the this argument
        //allows us to get object properties
        this.name = name;
        this.description = description;
        this.args = args;
        this.usage = usage;
        this.category = category;
    }

    async execute(client, message, args) {
        //return the function of the child
        return await client.commands.get(this.name).execute(message, args);
    }
    //returns array with all properties 
    /*maybe used like this:
    const props = super.getAllProperties()

    super cause it will be the parents function
    its pretty useful, saves lines and can multiuse!
    */
    getAllProperties() {
        props = [this.name, this.description, this.args, this.usage, this.category];
        return props;
    }
}
export default Command; 
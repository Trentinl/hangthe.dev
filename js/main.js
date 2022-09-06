const autocomplete_menu = require("./autocomplete_menu");

var API_PREFIX = 'https://api.github.com/repos/trentinl/trentinl.github.io',
    e = "user@hangthe.dev";
var GitHub = new (function() {
    this.fs = new Object;
    this.loaded = false;
    this.stack = new Array;

    this.getCurrentPath = function(){
        if(this.stack.length == 0) 
            return '~/';
        return this.stack.join('/')
    },    
    this.getCurrentWorkingDirectory = function() {
        if(this.stack.length == 0) 
            return this.fs;
        
        var fs = this.fs
        for(var i in this.stack) {
            fs = fs[this.stack[i]];
        }
        return fs;
    };
        
    var self = this;    
    $.getJSON(API_PREFIX + '/refs/heads/master', function(data, textStatus, jqXHR){
    //$.getJSON('data/master.json', function(data, textStatus, jqXHR){
        var sha = data.object.sha;
        $.getJSON(API_PREFIX + '/trees/'+sha+'?recursive=1', function(data, textStatus, jqXHR){
        //$.getJSON('data/tree.json', function(data, textStatus, jqXHR){
            for(i in data.tree) {
                var item = data.tree[i];                
                var paths = item.path.split('/');   
                
                var fs = self.fs;                
                for(var i=0; i< paths.length; i++) {
                    var path = paths[i];                    
                    
                    if(!fs.hasOwnProperty(path)) {
                       fs[path] = new Object;
                    } else {
                       fs = fs[path]
                    }
                       
                    if (i == paths.length-1) {
                        item.path = path;
                        fs[path] = item;
                    }
                }
            }
            self.loaded = true;
        });
    });
})();

var App = {
    echo: function(text) {
        this.echo(text);
        if(ga != undefined) ga('send', 'event', 'echo', GitHub.getCurrentPath(), 'text', text);
    },
    help: function() {
        this.echo("\nAvailable commands:\n");
        this.echo("\t[[b;#ffffff;]contact]     display contact infomation");
        this.echo("\t[[b;#ffffff;]whoami]      display my short brief");
        this.echo("\t[[b;#ffffff;]help]        this help screen.");    
        this.echo("\t[[b;#ffffff;]clear]       clear the console.");                    
        this.echo("");
        this.echo("Linux commands available: [[b;#ffffff;]cat cd id ls]")
        this.echo("");

        if(ga != undefined) ga('send', 'event', 'help', GitHub.getCurrentPath());
    },
    whoami: function() {
        this.echo("\nDon't believe we've met...\n");
        this.echo("Just for context, here's abit about myself\n");
        this.echo("\t- I'm a security enthusiast pursuing a degree in the area.");
        this.echo("\t- A CTF Competitor");
        this.echo("\t- A Programmer, mainly just to craft what I need");
        this.echo("\t- And an Ethical Hacker at the core");
        this.echo("\nI'm available to work as a freelancer, you can get in touch via the [[b;#ffffff;]contact] command\n");

        if(ga != undefined) ga('send', 'event', 'whoami', GitHub.getCurrentPath());
    },
    contact: function() {
        this.echo("\nGet in touch via:\n")
        this.echo("Email: <strong><a href='mailto:whispr@protonmail.com'>whispr@protonmail.com</a></strong>", {raw:true}); 
        this.echo("Discord: <strong><a href='https://discord.com/users/773619610641367070'>whispr#6666</a></strong> ", {raw:true}); 
        this.echo("\n"); 

        if(ga != undefined) ga('send', 'event', GitHub.getCurrentPath(), 'contact');
    },
    su: function(user) {
        window.location.href = "https://hangthe.dev/tdd.mp4";
        if(ga != undefined) ga('send', 'event', 'su', 'user', user);
    },
    sudo: function(user) {
        this.echo("You must be the root user to run this program")
        if(ga != undefined) ga('send', 'event', 'sudo', user);
    },
    
    id: function(){
        this.echo("uid=0(root) gid=0(root) groups=0(root)");

        if(ga != undefined) ga('send', 'event', 'id', GitHub.getCurrentPath());
    },
    ls: function() {        
        var wd = GitHub.getCurrentWorkingDirectory();
        for(i in wd) {
            if(typeof wd[i] == 'object') {
                var item = wd[i];
                this.echo(item.mode+'\t' + (item.type=='tree'?'[[b;#44D544;]'+item.path+']':item.path));
            }
        }

        if(ga != undefined) ga('send', 'event', 'ls', GitHub.getCurrentPath());
    },
    cd: function(path) {        
        if(path == '..') {
            GitHub.stack.pop();
            return;
        }        
        var wd = GitHub.getCurrentWorkingDirectory();
        var item = wd[path]
        if(!item) {
            this.error("cd: " + path + ": No such file or directory");
        } else if(item.type != 'tree') {
            this.error("cd: " + path  + ": Not a directory");
        } else {
            GitHub.stack.push(path);
        }

        if(ga != undefined) ga('send', 'event', 'cd', GitHub.getCurrentPath(), 'path', path);
    },
    cat: function(path){
        var wd = GitHub.getCurrentWorkingDirectory();
        var item = wd[path];
        if(!item) {
            this.error("cat: " + path + ": No such file or directory");
        } else if(item.type == 'tree') {
            this.error("cat: " + path  + ": Is a directory");
        } else {
            var term = this;
            term.pause();
            $.getJSON(item.url, function(data, textStatus, jqXHR){
                var content = data.content.trim()
                if(data.encoding == 'base64')
                    content = decode64(content);
                term.echo(content); 
                term.resume();
            });
        }
        if(ga != undefined) ga('send', 'event', 'cat', GitHub.getCurrentPath(), 'path', path);
    },
    startx: function() {
        this.error('xinit: unable to connect to X server: Resource temporarily unavailable\nxinit: server error');

        if(ga != undefined) ga('send', 'event', 'startx', GitHub.getCurrentPath());
    }
}


jQuery('body').terminal(function(command) {
}, {
    autocompleteMenu: true,
    completion: ['Documents', 'Logs', 'Music', 'Pictures', 'Projects', 'README.md', 'autoexec.cfg', 'passwords.txt', 'pgp.txt', 'tools.tar.gz', 'whispr.pem', 'pgp']
});




jQuery(document).ready(function($) {
    $('body').terminal(App, {
        greetings: 
            "             _                       \n" +
            "            | |                     \n" +
            "   __      _| |__  _ ___ _ __  _ __ \n" + 
            "   \\ \\ /\\ / / '_ \\| / __| '_ \\| '__|\n" +
            "    \\ V  V /| | | | \\__ \\ |_) | |   \n" +
            "     \\_/\\_/ |_| |_|_|___/ .__/|_|   \n" +
            "                        | |         \n" +
            "                        |_|         \n" +
            "\n" +





            "\nType [[b;#ffffff;]ls] to explore resources on this page and [[b;#ffffff;]help] for the obvious reasons.\n",
        prompt: function(p){
            var path = '~'
            if(GitHub.stack.length > 0) {
                for(i in GitHub.stack) {
                    path+= '/';
                    path+= GitHub.stack[i]
                }
            }
            p("user@hangthe.dev" + ":" + path + "# ");
        },
        onBlur: function() {
            // prevent loosing focus
            return false;
        },
        tabcompletion: true,
        
    });
});

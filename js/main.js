var API_PREFIX = 'https://api.github.com/repos/trentinl/hangthe.dev/git',
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
    su: function(name, password, callback) {
        console.log("ok");
        if(name == "root"){
            callback("token");
        } else {
            callback(false);
        }
    },
    sudo: function(user) {
        this.echo("You must be the root user to run this program")
        if(ga != undefined) ga('send', 'event', 'sudo', user);
    },
    
    id: function(){
        this.echo("[[b;#ffffff;]uid=0(root) gid=0(root) groups=0(root)]");

        if(ga != undefined) ga('send', 'event', 'id', GitHub.getCurrentPath());
    },
    
    pgp: function() {
        this.echo("\n")
        this.echo("-----BEGIN PGP PUBLIC KEY BLOCK-----\n")
        this.echo("\n")
        this.echo("mQINBGMXQMwBEADUPaZPauU+ini0v7dPzF28vByBVYP/yIoDSHbHzEuLHb7921bL\n")
        this.echo("AOy6NU9iU19J4H1V1EZqviiZPMSuVLM4vZITaPJuQZGrV32L1AMOcN9Z1mUyYaUL\n")
        this.echo("vlMKEBZvG8hyXJP9F8V1gfFpOF5IEyzsNA3iyEMVVxN04wLPXaPDEvWK/Rsi8Gij\n")
        this.echo("qcGy5YwGRO8IFo7gnOE9leii9RV4/ivW66HW5IOjWNazdCAaZ3TbsTO0jU6yOr6h\n")
        this.echo("G40dQk13bg6tCcviyhqNIwdzvFswqYJlKojoF2YphrsGdFN7VtIpkhrnIGlsWhZ/\n")
        this.echo("0a+TZYJ3KK13rcjBTeOH+WM+3ift97Gag0RGwUIpGJq2L/nhhbGd0ed93Z0wT5x+\n")
        this.echo("iH8TKN9omHOjm3zRRFhEko9HmXLk8uNeIZEP8HkQqfCvRNC9i167/HPZ2XbNcQ6q\n")
        this.echo("VMFhlrIZy3E0qZsbvPGH7OgD0EAjWC+jpn1eUb91U64GRKevAN1PWYpvirI9mR3m\n")
        this.echo("W5aLSWu78eq+4Z2VV0dNbj/4ZDLudu0VWvFWoXRRZ74BkVB30sGxMGEE8/H1kAfx\n")
        this.echo("/rYKoYJP1vQY4MnHX4xAnxHHUMLLooeUYQ+zwVrnYAVvqT/6d7eev+wnTOinqPsO\n")
        this.echo("ZPjIErBEZB0ZdIHpU9V16jJT9ZX5/wTWQEzvDHdpWhOlamK8MqsVgyCkJwARAQAB\n")
        this.echo("tB53aGlzcHIgPHdoaXNwckBwcm90b25tYWlsLmNvbT6JAk4EEwEKADgWIQQTd0yl\n")
        this.echo("jE1ljA0MmTvyea1Qy1eSyQUCYxdAzAIbAwULCQgHAgYVCgkICwIEFgIDAQIeAQIX\n")
        this.echo("gAAKCRDyea1Qy1eSyYbqD/4uGPmEVjxfP9LdW2MogFDpMxsm+CzcIgpWB02Wz+Hb\n")
        this.echo("rQAEwFFZcMXGyRrxMst51FFMmcxGLjnKXGo8FiBZeVhmcOUzsm0mqQF5RHItxvz5\n")
        this.echo("1E0wweBsA8jTJQU1J7oa/24520nDWf1HokHCcafHkseeLV1Pt+fy4Xp4HeVWCQwc\n")
        this.echo("s2wpFIdQHsUMQhr2V0jZEq+2tIsNgOo9gUIUtYNRRfVgcvbEu2lurWz0HcWa7BEp\n")
        this.echo("WQsdTsrEWhYNiHb14GvmMZ6gFvk0zzCG8syNxyv+9IaGbNajsVxRC5wI8ApO3ipn\n")
        this.echo("jEhMIY0PNITX7xZkzUsOb79AQtFdeyct7e4O/M65zRJUNZ86IYgUuJqQk2DRJGBV\n")
        this.echo("+2Yd/UVIz/omGv5z3i4/9YESMhQMqZfkmJWABoLuylgwFCdIOAP5pvhNyXtiBCtm\n")
        this.echo("vAgDDcJSySpFbMUScHTztE8ZDw+oPxqFmHUs684/uXquE0EfezZ4hsDTwIjd289b\n")
        this.echo("gYEyNODn+6WQP7SF7ti9x8i4nSJ8HQeW1fVCeKCDaOtErbtsLT96P63cDoPWuik5\n")
        this.echo("rr3xU6fWkYHMe0gd1RlYcP9h8C8R8bZevW4V7+X+4MXoyrIAxnLSEosLXzn1j6+T\n")
        this.echo("z8vkkFNe1l31IMG6It1IMImG1OL6DL+5WuUz6aQ6J5k/LhRDLYdOtWAX0nX26LG4\n")
        this.echo("u7kCDQRjF0DMARAAtjJPYyyIzhqIqlz2h75d/xV0RdSwSu45K66dY8aVpkYwBIP2\n")
        this.echo("Hz4B6JkFiJ6mnP4QyGMH8jNkvNg7I+0yNmw13f42YCe2yEfK3I/OkpftXtJUoyEh\n")
        this.echo("B+b8S7LYyAf3N9kg+dvJziJGRGTOC10qcoTHbdDbKs0diUm9swchJfnWpUknQkam\n")
        this.echo("rxYgqymZr6nFxFTTkTQXJtLu8HqnAdunkmUDtvvPGWMFlRpIsRoNhXWDWNUAHj8M\n")
        this.echo("um8c0LU/TI7w5Vl53qs0lWPLnqawrv1jiyL8KM/I3QGBOcWbHwyvtoUpCeLcUeKl\n")
        this.echo("O6NeqEDNZpOrmb4KBzoEpHHbCzLqHitU/Y+FfT5TEtr/zCVdkHGgu2Geem2H/gee\n")
        this.echo("8arzlUyvzwA3DHV86dwd7C5PqfK5CzPYd0qPupnO0fA0AtwfR0MW28LtL4fcwPU7\n")
        this.echo("nBhWxMW4Epq/t+4YAIt68plg34rundVHThIVAMi92UFaPB8i5EsDYMGPrFQogfU2\n")
        this.echo("m7iQIhUD0zCtA0CU1I9dcd7rLDQqwBezegewzjL0zeathAhiHj6T5Iaww2oqMD5V\n")
        this.echo("IbgBcx5ZHv2hNJt4wqk5jl+AzeCWTfNT0mP/or5epc0YY9qGoPk1JDbMRcuIvyJ/\n")
        this.echo("Zs+RB3LrQkUtBKYEhJZFAJjrIyeUbhvLOI/KVnOiVTkAqrkCbvwrKEHdh8EAEQEA\n")
        this.echo("AYkCNgQYAQoAIBYhBBN3TKWMTWWMDQyZO/J5rVDLV5LJBQJjF0DMAhsMAAoJEPJ5\n")
        this.echo("rVDLV5LJHLMQAKSc46+oDs2Gd2RRe1YxIYFbT/YUlQVwc+v6iDzb2ZHBJmXHfvVo\n")
        this.echo("QM2ZPBDfZIANRLzoHzriYbrvVoZyTHM18PkbhbXD4iAMLBKfDcWowxDWrePiw0JD\n")
        this.echo("onglKYzDFZ6Hxp7KLO1kzi7NZEZR1P8iHhhxtru1D10Dtbn16ZVYXDnT5azYZ3E2\n")
        this.echo("E4KFEtYfr2vP8tYAkeiuFmNYrd6Vezn/mSMnpl71+2Irxz2IfvTGrdKxX0U2zxRJ\n")
        this.echo("rfPT4tzSZyFN+qwNbuWSOMoP14xjQbk1iZ8C1cKblSLzZjyq45gyjfLf/w8BQW/Q\n")
        this.echo("uqYvcxwfR+U4+qXpAiYzw/Z4TcVmrY2fTUgbgNjuzjwO9VWgDVFY8oiu7dza22cU\n")
        this.echo("zQxLvwZwnx0vqjz/cWcREBCmCiXMX4JIVadYMxltmv1fUukil9+efgDPljY77QwP\n")
        this.echo("5bPk9n/w5HoBpGRleCjcbE2JpUw/iVoVniTqMKetOK0D506IBuA4mhdYrxgynjac\n")
        this.echo("x6jfTT9t0Agf/MVP5JvTpAbrECRJ4xIRhjvak5SQQdOb2MY2DmKNnGfDCv2s4F2L\n")
        this.echo("FtT/NqzfpjIU6QYn+K6EbLD0qmTb1TKVUohLZkkPQY5STWvhPwjHAdPR\n")
        this.echo("=CKw+\n")
        this.echo("\n");
        this.echo("-----END PGP PUBLIC KEY BLOCK-----\n");
        this.echo("\n"); 

        if(ga != undefined) ga('send', 'event', GitHub.getCurrentPath(), 'pgp');

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

window.mobileAndTabletcheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }
  




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
        tabcompletion: true
    });
});

var API_PREFIX = 'https://api.github.com/repos/trentinl/hangthe.dev/git',
    e = "whispr@hangthe.dev";

var GitHub = new (function() {
    this.fs     = {};
    this.loaded = false;
    this.stack  = [];

    this.getCurrentPath = function() {
        return this.stack.length === 0
            ? '~/'
            : this.stack.join('/');
    };

    this.getCurrentWorkingDirectory = function() {
        if (this.stack.length === 0) {
            return this.fs;
        }
        var node = this.fs;
        this.stack.forEach(function(dir) {
            node = node[dir];
        });
        return node;
    };

    var self = this;

    // Fetch the SHA for master
    $.getJSON(API_PREFIX + '/refs/heads/master')
     .done(function(refData) {
        var sha = refData.object.sha;

        // Fetch the full tree recursively
        $.getJSON(API_PREFIX + '/trees/' + sha + '?recursive=1')
         .done(function(treeData) {
            treeData.tree.forEach(function(item) {
                var parts  = item.path.split('/');
                var cursor = self.fs;

                parts.forEach(function(part, idx) {
                    var isLeaf = (idx === parts.length - 1);

                    if (!isLeaf) {
                        // Ensure directory exists, then descend
                        cursor[part] = cursor[part] || {};
                        cursor = cursor[part];
                    } else {
                        // Leaf node: assign the GitHub item
                        item.path = part;  // keep only basename
                        cursor[part] = item;
                    }
                });
            });

            self.loaded = true;
         })
         .fail(function(err) {
            console.error('Error fetching tree:', err);
         });
     })
     .fail(function(err) {
        console.error('Error fetching master ref:', err);
     });
})();


var App = {
    echo: function(text, opts) {
        this.echo(text, opts);
    },

    help: function() {
        this.echo("\nAvailable commands:\n");
        this.echo("\t[[b;#ffffff;]contact]     display contact information");
        this.echo("\t[[b;#ffffff;]whoami]      display my short brief");
        this.echo("\t[[b;#ffffff;]pgp]         display public pgp key");
        this.echo("\t[[b;#ffffff;]su root]     enable session root permissions");
        this.echo("\t[[b;#ffffff;]clear]       clear the console.");
        this.echo("");
        this.echo("Navigational commands: [[b;#ffffff;]cat cd id ls pwd]");
        this.echo("");
    },

    whoami: function() {
        this.echo("\nDon't believe we've met...\n");
        this.echo("Just for context, here's a bit about myself\n");
        this.echo("\t- I'm a security enthusiast pursuing a degree in the area.");
        this.echo("\t- A CTF Competitor");
        this.echo("\t- A Programmer, mainly just to craft what I need");
        this.echo("\t- And an Ethical Hacker at the core");
        this.echo("\nI'm available to work as a freelancer, you can get in touch via the [[b;#ffffff;]contact] command\n");
    },

    contact: function() {
        this.echo("\nGet in touch via:\n");
        this.echo("Email: <strong><a href='mailto:whispr@protonmail.com'>whispr@protonmail.com</a></strong>", { raw: true });
        this.echo("Discord: <strong><a href='https://discord.com/users/hangthe.dev'>hangthe.dev</a></strong>", { raw: true });
        this.echo("\n");
    },

    su: function(user) {
        window.location.href = "https://hangthe.dev/td.mp4";
    },

    sudo: function(user) {
        this.echo("You must be the root user to run this program");
    },

    pgp: function() {
        this.echo("\n-----BEGIN PGP PUBLIC KEY BLOCK-----\n");
        // ... (PGP key lines omitted for brevity) ...
        this.echo("-----END PGP PUBLIC KEY BLOCK-----\n");
    },

    id: function() {
        this.echo("[[b;#ffffff;]uid=0(root) gid=0(root) groups=0(root)]");
    },

    ls: function() {
        var wd = GitHub.getCurrentWorkingDirectory();
        Object.keys(wd).forEach(function(name) {
            var item = wd[name];
            if (item && item.type) {
                var display = item.type === 'tree'
                    ? '[[b;#44D544;]' + item.path + ']'
                    : item.path;
                this.echo((item.mode || '') + '\t' + display);
            }
        }, this);
    },

    cd: function(path) {
        if (path === '..') {
            this.stack.pop();
            return;
        }
        var wd = GitHub.getCurrentWorkingDirectory();
        var item = wd[path];
        if (!item) {
            this.error("cd: " + path + ": No such file or directory");
        } else if (item.type !== 'tree') {
            this.error("cd: " + path + ": Not a directory");
        } else {
            GitHub.stack.push(path);
        }
    },

    cat: function(path) {
        var wd = GitHub.getCurrentWorkingDirectory();
        var item = wd[path];
        if (!item) {
            this.error("cat: " + path + ": No such file or directory");
        } else if (item.type === 'tree') {
            this.error("cat: " + path + ": Is a directory");
        } else {
            var term = this;
            term.pause();
            $.getJSON(item.url)
             .done(function(data) {
                var content = data.content.trim();
                if (data.encoding === 'base64') {
                    content = decode64(content);
                }
                term.echo(content);
                term.resume();
             })
             .fail(function(err) {
                term.error("cat: error fetching " + path);
                term.resume();
             });
        }
    },

    pwd: function() {
        this.echo(GitHub.getCurrentPath());
    },

    startx: function() {
        this.error('xinit: unable to connect to X server: Resource temporarily unavailable\nxinit: server error');
    }
};

function handleAutocomplete(term) {
    var command  = term.get_command();
    var words    = command.split(' ');
    var lastWord = words[words.length - 1];
    var fs       = GitHub.getCurrentWorkingDirectory();
    var suggestions = Object.keys(fs).filter(function(f) {
        return f.startsWith(lastWord);
    });

    if (suggestions.length === 1) {
        words[words.length - 1] = suggestions[0];
        term.set_command(words.join(' ') + ' ');
    } else if (suggestions.length > 1) {
        term.echo(suggestions.join('\n'));
    }
}

jQuery(function($) {
    const isMobile = /iPhone|iPad|iPod|Android|Pixel|webOS|BlackBerry|Windows Phone|Opera Mini|IEMobile/i
                     .test(navigator.userAgent);

    if (isMobile) {
        $('#mobile-input').show();
        $('#mobile-input').on('keypress', function(e) {
            if (e.key === 'Enter') {
                var cmd = $(this).val();
                $('#terminal').terminal().exec(cmd);
                $(this).val('');
            }
        });
    } else {
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
                "\nType [[b;#ffffff;]ls] to explore resources on this page and [[b;#ffffff;]help] for the obvious reasons.\n",
            prompt: function(callback) {
                var path = '~';
                if (GitHub.stack.length > 0) {
                    path += '/' + GitHub.stack.join('/');
                }
                callback("whispr@hangthe.dev:" + path + "# ");
            },
            onBlur: function() {
                if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                    return true;
                }
                return false;
            },
            tabcompletion: true,
            mobileIgnoreAutoFocus: false,
            useDefaultInput: true,
            completion: function(command, callback) {
                var fs = GitHub.getCurrentWorkingDirectory();
                var suggestions = Object.keys(fs).filter(function(f) {
                    return f.startsWith(command);
                });
                callback(suggestions);
            }
        });
    }
});


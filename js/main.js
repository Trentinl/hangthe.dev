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
        this.echo("\n")
        this.echo("") 
        this.echo("") 
        this.echo("\n"); 
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
        this.echo("\n")
        this.echo("\n");
        this.echo("-----END PGP PUBLIC KEY BLOCK-----\n");
        this.echo("\n"); 
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


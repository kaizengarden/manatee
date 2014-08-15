#!/usr/bin/env node
// -*- mode: js -*-

var fs = require('fs');
var util = require('util');

var adm = require('../lib/adm');
var cmdln = require('cmdln');


function ManateeAdm() {
    cmdln.Cmdln.call(this, {
        name: 'manatee-adm',
        desc: 'Inspect and administer Manatee'
    });
}
util.inherits(ManateeAdm, cmdln.Cmdln);

/**
 * Display the current state of the manatee shard(s).
 */
ManateeAdm.prototype.do_status = function do_status(subcmd, opts, args, cb) {
    var self = this;
    if (opts.help) {
        self.do_help('help', {}, [subcmd], cb);
    }

    if (!opts.zk) {
        self.do_help('help', {}, [subcmd], cb);
    }

    adm.status(opts, function (err, status) {
        if (err) {
            return cb(err);
        } else {
            console.log(JSON.stringify(status));
            return cb();
        }
    });
};
ManateeAdm.prototype.do_status.options = [ {
    names: ['help', 'h'],
    type: 'bool',
    help: 'Show this help'
}, {
    names: ['shard', 's'],
    type: 'string',
    helpArg: 'SHARD',
    help: 'The manatee shard to stat. If empty status will show all shards'
}, {
    names: ['zk', 'z'],
    type: 'string',
    helpArg: 'ZOOKEEPER_URL',
    help: 'The zookeeper connection string. e.g. 127.0.0.1:2181',
    default: process.env.ZK_IPS
}];
ManateeAdm.prototype.do_status.help = (
    'Show status of a manatee shard. \n' +
    '\n' +
    'Usage:\n' +
    '    {{name}} status [OPTIONS]\n' +
    '\n' +
    '{{options}}'
);

/**
 * Clear a manatee shard out of safe mode.
 */
ManateeAdm.prototype.do_check_lock = function (subcmd, opts, args, cb) {
    var self = this;
    if (opts.help) {
        self.do_help('help', {}, [subcmd], cb);
    }

    if (!opts.path) {
        self.do_help('help', {}, [subcmd], cb);
    }

    if (!opts.zk) {
        self.do_help('help', {}, [subcmd], cb);
    }

    adm.checkLock(opts, function (err, stat) {
        if (err || stat) {
            return cb(new Error('lock exists or unable to get lock'));
        }

        return cb();
    });
};
ManateeAdm.prototype.do_check_lock.options = [ {
    names: ['help', 'h'],
    type: 'bool',
    help: 'Show this help'
}, {
    names: ['path', 'p'],
    type: 'string',
    helpArg: 'LOCK_PATH',
    help: 'The manatee lock path in ZK'
}, {
    names: ['zk', 'z'],
    type: 'string',
    helpArg: 'ZOOKEEPER_URL',
    help: 'The zookeeper connection string. e.g. 127.0.0.1:2181',
    default: process.env.ZK_IPS
}];
ManateeAdm.prototype.do_check_lock.help = (
    'Clear a shard out of safe mode. \n' +
    '\n' +
    'Usage:\n' +
    '    {{name}} status [OPTIONS]\n' +
    '\n' +
    '{{options}}'
);

/**
 * Get the state transition history of the shard.
 */
ManateeAdm.prototype.do_history = function do_clear(subcmd, opts, args, cb) {
    var self = this;
    if (opts.help) {
        self.do_help('help', {}, [subcmd], cb);
    }

    if (!opts.shard) {
        self.do_help('help', {}, [subcmd], cb);
    }

    adm.history(opts, function (err, result) {
        if (err) {
            return cb(err);
        }

        for (var i = 0; i < result.length; i++) {
            console.log(JSON.stringify(result[i]));
        }
        return cb();
    });
};
ManateeAdm.prototype.do_history.options = [ {
    names: ['help', 'h'],
    type: 'bool',
    help: 'Show this help'
}, {
    names: ['shard', 's'],
    type: 'string',
    helpArg: 'SHARD',
    help: 'The manatee shard',
    default: process.env.SHARD
}, {
    names: ['zk', 'z'],
    type: 'string',
    helpArg: 'ZOOKEEPER_URL',
    help: 'The zookeeper connection string. e.g. 127.0.0.1:2181',
    default: process.env.ZK_IPS
}];
ManateeAdm.prototype.do_history.help = (
    'Clear a shard out of safe mode. \n' +
    '\n' +
    'Usage:\n' +
    '    {{name}} status [OPTIONS]\n' +
    '\n' +
    '{{options}}'
);

/**
 * Rebuild a manatee peer in a shard.
 */
ManateeAdm.prototype.do_rebuild = function do_rebuild(subcmd, opts, args, cb) {
    var self = this;
    if (opts.help) {
        self.do_help('help', {}, [subcmd], cb);
    }
    if (!opts.config) {
        self.do_help('help', {}, [subcmd], cb);
    }

    var cfg;

    try {
        cfg = JSON.parse(fs.readFileSync(opts.config, 'utf8'));
        opts.config = cfg;
    } catch (e) {
        return cb(e);
    }
    adm.rebuild(opts, cb);
};
ManateeAdm.prototype.do_rebuild.options = [ {
    names: ['help', 'h'],
    type: 'bool',
    help: 'Show this help'
}, {
    names: ['config', 'c'],
    type: 'string',
    helpArg: 'CONFIG',
    help: 'The path to the manatee sitter config to list',
    default: process.env.MANATEE_SITTER_CONFIG
}];
ManateeAdm.prototype.do_rebuild.help = (
    'Rebuild a manatee zone. \n' +
    '\n' +
    'Usage:\n' +
    '    {{name}} status [OPTIONS]\n' +
    '\n' +
    '{{options}}'
);

/**
 * Promote a manatee peer to the primary of the shard.
 */
ManateeAdm.prototype.do_promote = function do_promote(subcmd, opts, args, cb) {
    var self = this;
    if (opts.help) {
        self.do_help('help', {}, [subcmd], cb);
    }
    if (!opts.config) {
        self.do_help('help', {}, [subcmd], cb);
    }

    var cfg;

    try {
        cfg = JSON.parse(fs.readFileSync(opts.config, 'utf8'));
        opts.config = cfg;
    } catch (e) {
        return cb(e);
    }
    adm.promote(opts, cb);
};
ManateeAdm.prototype.do_promote.options = [ {
    names: ['help', 'h'],
    type: 'bool',
    help: 'Show this help'
}, {
    names: ['config', 'c'],
    type: 'string',
    helpArg: 'CONFIG',
    help: 'The path to the manatee sitter config to list',
    default: process.env.MANATEE_SITTER_CONFIG
}];
ManateeAdm.prototype.do_promote.help = (
    'Promote a manatee peer to the primary of the shard. \n' +
    '\n' +
    'Usage:\n' +
    '    {{name}} status [OPTIONS]\n' +
    '\n' +
    '{{options}}'
);

cmdln.main(ManateeAdm);
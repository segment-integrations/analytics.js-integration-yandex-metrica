
/**
 * Module dependencies.
 */

var bind = require('bind');
var integration = require('analytics.js-integration');
var tick = require('next-tick');
var when = require('when');

/**
 * Expose `Yandex` integration.
 */

var Yandex = module.exports = integration('Yandex Metrica')
  .assumesPageview()
  .global('yandex_metrika_callbacks')
  .global('Ya')
  .option('type', 0)
  .option('counterId', null)
  .option('clickmap', false)
  .option('webvisor', false)
  .option('trackHash', false)
  .option('trackLinks', false)
  .option('accurateTrackBounce', false)
  .option('params', null)
  .tag('<script src="//mc.yandex.ru/metrika/watch.js">');

/**
 * Initialize.
 *
 * https://tech.yandex.com/metrika/
 * http://help.yandex.com/metrica/objects/creating-object.xml
 *
 * @api public
 */

Yandex.prototype.initialize = function() {
  var id = this.options.counterId;
  var type = this.options.type;
  var clickmap = this.options.clickmap;
  var webvisor = this.options.webvisor;
  var trackHash = this.options.trackHash;
  var trackLinks = this.options.trackLinks;
  var accurateTrackBounce = this.options.accurateTrackBounce;
  var params = this.options.params;

  push(function() {
    window['yaCounter' + id] = new window.Ya.Metrika({
      id: id,
      type: type,
      clickmap: clickmap,
      webvisor: webvisor,
      trackHash: trackHash,
      trackLinks: trackLinks,
      accurateTrackBounce: accurateTrackBounce,
      params: params
    });
  });

  var loaded = bind(this, this.loaded);
  var ready = this.ready;
  this.load(function() {
    when(loaded, function() {
      tick(ready);
    });
  });
};

/**
 * Loaded?
 *
 * @api private
 * @return {boolean}
 */

Yandex.prototype.loaded = function() {
  return !!(window.Ya && window.Ya.Metrika);
};

/**
 * Push a new callback on the global Yandex queue.
 *
 * @api private
 * @param {Function} callback
 */

function push(callback) {
  window.yandex_metrika_callbacks = window.yandex_metrika_callbacks || [];
  window.yandex_metrika_callbacks.push(callback);
}

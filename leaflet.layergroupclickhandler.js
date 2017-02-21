/* global L:true */

'use strict'

/**
 * Makes LayerGroups clickable via fill and handles clicks
 * @param group
 * @constructor
 */
var LayerGroupClickHandler = function (group) {
  var self = this
  var activeCallback
  var backup = {}
  var enabled = false

  var forEachLayer = function (layer, callback) {
    if ('getLayers' in layer) {
      layer.getLayers().forEach(function (subLayer) {
        forEachLayer(subLayer, callback)
      })
    } else if ('options' in layer) {
      callback(layer)
    }
  }

  this.enabled = function () {
    return enabled
  }

  this.enable = function (callback) {
    enabled = true

    forEachLayer(group, function (layer) {
      var id = layer._leaflet_id

      if (!(id in backup)) {
        backup[id] = {fill: layer.options.fill}
      }

      layer.setStyle({fill: true})
    })

    group.getLayers().forEach(function (layer) {
      layer.on('click', function (event) {
        event.layer = layer

        callback(event)
      })
    })

    activeCallback = callback
  }

  this.disable = function () {
    enabled = false

    forEachLayer(group, function (layer) {
      var id = layer._leaflet_id

      if (id in backup) {
        layer.setStyle(backup[id])
      } else {
        layer.setStyle({fill: false})
      }
    })

    group.getLayers().forEach(function (layer) {
      layer.off('click', activeCallback)
    })
  }

  this.update = function () {
    if (enabled) {
      self.enable(activeCallback)
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = LayerGroupClickHandler
} else {
  L.LayerGroupClickHandler = LayerGroupClickHandler
}

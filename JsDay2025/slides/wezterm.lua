local wezterm = require 'wezterm'
local config = {}

config.keys = {
  {
    key = 'F11',
    mods = '',
    action = wezterm.action.ToggleFullScreen,
  },
}

config.font = wezterm.font 'FiraCode Nerd Font Mono'
config.font_size = 30
config.hide_tab_bar_if_only_one_tab = true
config.default_cwd = '/mnt/data/massi/massi/talks/JsDay2025/slides'

--config.color_scheme = 'Batman'

return config

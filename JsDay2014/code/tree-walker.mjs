#metaimport macros

var v = 0

'''
  2 + 1
    |
    # * 2
      |
      # / 3
        |
        v
'''

v = (((2 + 1) * 2) / 3)


v = |>
  2 + 1
  # * 2
  # / 3

v = |>
  2 + 1
  * 2
  / 3


v = |>
  #next / 3
  #next * 2
  2 + 1


v = (5 * 4) - Math.pow(4, 2)

'''
  5 * 4     Math.pow(4,2)
    |           |
   #left  -   #right
'''

v = |>
  :# left - :# right
  left: 5 * 4
  right: Math.pow(4, 2)

'''
  5 * 4      Math
    |         |
    |         # <- pow(4,2)
    |           |
    #left  -    #right
'''

v = |>
  :# left - :# right
  left: 5 * 4
  right: |>
    Math
    .pow(4, 2)


rm *.png
for DAT in *.dat; do echo $DAT; gnuplot < $DAT; done

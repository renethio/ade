

This is our Yageren page

Instruction to run this code 
To run this code first attach your volume(ebs) if it is not attached. Got to aws console and attach the volume you want to attach. 
After attaching the volume got to the command line by SSHing to the instance. 
If the volume is new make sure to create a file system- refer aws on how to create a file system. But if your volume has a file system already created, follow the instruction below on how to mount it. 
To check the name of the volume attached using the following command
[centos@ip-172-31-94-181 data]$ lsblk
NAME    MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
xvda    202:0    0   12G  0 disk
└─xvda1 202:1    0   12G  0 part /
xvdf    202:80   0  100G  0 disk

you add ‘/dev/’ in front of each volume to completes its name for instance if the listed name is ‘xvdv’ then the volume name is ‘/dev/xvdf’ 
 
To check if your volume has a file system by using the following command
sudo file -s /dev/xvdf
if you see ‘/data’ only then your volume is new and it needs filesystem to be created. 

To mount the volume use the code below
sudo mount /dev/xvdf /data/db

where /dev/xvdf is the name of the volume and /data/db is the mount point

To run mongod at the backgroung use the –fork method

[centos@ip-172-31-94-181 data]$ sudo mongod --fork --logpath /data/log/mongodb.log
about to fork child process, waiting until server is ready for connections.
forked process: 1844
child process started successfully, parent exiting

To run the app use the following command(make sure you are in ‘ade’ directory 
sudo pm2 start server.js


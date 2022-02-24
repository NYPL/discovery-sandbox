#!/usr/bin/env bash

. /opt/elasticbeanstalk/support/envvars
cd /home/ec2-user

yum -q list installed falcon-sensor &> /dev/null && isInstalled="yes" || isInstalled="no"

if [ $isInstalled == "no" ]; then
    wget https://s3.amazonaws.com/nypl-rpms/falcon-sensor-6.33.0-13003.el7.x86_64.rpm
    sudo yum -y install /home/ec2-user/falcon-sensor-6.33.0-13003.el7.x86_64.rpm
    sudo /opt/CrowdStrike/falconctl -s --cid=2F323D2F1EF049D0BCE9A15DDC55D946-19
fi

sudo systemctl enable falcon-sensor
sudo systemctl start falcon-sensor
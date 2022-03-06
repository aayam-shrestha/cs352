#include "colors.inc"
#include "textures.inc"
#include "glass.inc"

camera {
    // orthographic angle 0
    // location <0, 18.2, -38> // Frontview
    // location <-29, 0.8, 0> // Leftview
    // location <29, 10, 0> // Rightview
    // location <0, 30, 0> // Topview
    location <-15, 14.5, -22> // <x, y, z>
    look_at  <0, 7,  0> // <x, y, z>
}

light_source {
    <2, 10, -10>
    color Gray75
    fade_distance 15
    fade_power 4
    // shadowless
}

light_source {
    <-10, 10, -10>
    color Gray75
    fade_distance 10
    fade_power 2
    // shadowless
}

global_settings { ambient_light rgb<1, 1, 1> }

plane { // Floor
    y, 0 // perpendicular to axis, offset
    pigment{ checker
    <1.0, 1.0, 1.0>, // checker color 1
    <0.0, 0.0, 0.0>, // checker color 2
    }
    finish {
        diffuse 0.4
        ambient 0.2
        phong 1
        phong_size 50
        reflection .15
        }
}

plane { // Background Plane
    y, 0
    pigment {
        color White
    }
    finish {
        phong 0.9
        phong_size 60
        metallic
        reflection{
            1
            metallic
        }
    }
    rotate <90, 90, 0>
    translate<25, 0, 35>
}

plane { // Background Plane
    y, 0
    pigment {
        color White
    }
    finish {
        phong 0.9
        phong_size 60
        metallic
        reflection{
            1
            metallic
        }
    }
    rotate <90, 160, 0>
    translate<25, 0, 35>
}

#declare body = union { // Body
    box {   // Lower, yellow half of the body
        <-3.5, -3.5, -3.5>, <3.5, 3.5, 3.5>
        texture{
            pigment{ color <0.9, 0.47, 0>}
        }
        normal { bumps 0.01 scale 2 }
        finish {
            ambient .1
            diffuse .1
            specular 1
            roughness .6
            metallic
            reflection {
            .1
            metallic
            }
        }
        translate y*4.5
    }
    box {   // Upper, metallic half of body
        <-3.51, -1, -3.51>, <3.51, 1.5, 3.51>
        texture{
            Brushed_Aluminum
        }
        finish{
            ambient 0.01
            diffuse 0.5
            phong 0.2
            roughness 0.03
        }
        translate y*6.51
    }
}

#declare left_tread_cylinders = union {
    cylinder {  // Largest rear cylinder
        <-2.2, 0, 0>, <0, 0, 0>, 1.5
        translate <-3.5, 1.8, 2.8>
    }
    cylinder {  // Smaller front cylinder
        <-2.2, 0, 0>, <0, 0, 0>, 1.1
        translate <-3.5, 1.3, -2.8>
    }
    cylinder {  // Smallest top cylinder
        <-2.2, 0, 0>, <0, 0, 0>, 0.8
        translate <-3.5, 4.7, 0.3>
    }
    pigment{ Gray50 }
}

#declare left_tread_tracks = union {
    box {   // Floor treads
        <-6, 0, 3>, <-3.5, 0.3, -3>
    }
    box {  // Rear treads
        <-6, 3.4, 2.2>, <-3.5, 3.7, -1.6>
        rotate x*37
        translate y*1.5 -z*0.2
    }
    box {  // Front treads
        <-6, 3.4, 2.5>, <-3.5, 3.7, -2.2>
        rotate -x*42
        translate <0, 0.97, 0.4>
    }
}

#declare left_tread_corners = union {
    difference {    // Rear rounded corner
    cylinder {
        <-2.5, 0, 0>, <0, 0, 0>, 1.7 
    }
    cylinder {  
        <-2.6, 0, 0>, <0, 0, 0>, 1.4 
    }
    translate <-3.5, 1.7, 2.9>
    }

    difference{     // Front rounded corner
        cylinder {
            <-2.5, 0, 0>, <0, 0, 0>, 1.3 
        }
        cylinder { 
            <-2.6, 0, 0>, <0, 0, 0>, 1 
        }
        translate <-3.5, 1.3, -2.8>
    }

    difference { // Top rounded corner
        cylinder {
            <-2.5, 0, 0>, <0, 0, 0>, 0.9
        }
        cylinder { 
            <-2.6, 0, 0>, <0, 0, 0>, 0.6
        }
        translate <-3.5, 4.65, 0.3>
    }
}

#declare right_tread_cylinders = union {
    cylinder {  // Largest rear cylinder
        <0, 0, 0>, <2.2, 0, 0>, 1.5
        translate <3.5, 1.8, 2.8>
    }
    cylinder {  // Smaller front cylinder
        <0, 0, 0>, <2.2, 0, 0>, 1.1
        translate <3.5, 1.3, -2.8>
    }
    cylinder {  // Smallest top cylinder
        <0, 0, 0>, <2.2, 0, 0>, 0.8
        translate <3.5, 4.7, 0.3>
    }
    pigment{ Gray50 }
}

#declare right_tread_tracks = union {
    box {   // Floor treads
        <6, 0, 3>, <3.5, 0.3, -3>
    }
    box {  // Rear treads
        <6, 3.4, 2.2>, <3.5, 3.7, -1.6>
        rotate x*37
        translate y*1.5 -z*0.2
    }
    box {  // Front treads
        <6, 3.4, 2.5>, <3.5, 3.7, -2.2>
        rotate -x*42
        translate <0, 0.97, 0.4>
    }
}

#declare right_tread_corners = union {
    difference {    // Rear rounded corner
    cylinder {
        <2.5, 0, 0>, <0, 0, 0>, 1.7 
    }
    cylinder {  
        <2.6, 0, 0>, <0, 0, 0>, 1.4 
    }
    translate <3.5, 1.7, 2.9>
    }

    difference{     // Front rounded corner
        cylinder {
            <2.5, 0, 0>, <0, 0, 0>, 1.3 
        }
        cylinder { 
            <2.6, 0, 0>, <0, 0, 0>, 1 
        }
        translate <3.5, 1.3, -2.8>
    }

    difference { // Top rounded corner
        cylinder {
            <2.5, 0, 0>, <0, 0, 0>, 0.9
        }
        cylinder { 
            <2.6, 0, 0>, <0, 0, 0>, 0.6
        }
        translate <3.5, 4.65, 0.3>
    }
}

#declare left_tread = union {
    object{left_tread_tracks}
    object{left_tread_corners}
    object{left_tread_cylinders}
}

#declare right_tread = union {
    object{right_tread_tracks}
    object{right_tread_corners}
    object{right_tread_cylinders}
}

#declare treads = union {
    object{left_tread}
    object{right_tread}
    texture{
        pigment { color <0.15, 0.1, 0.1> }
        normal { bumps 0.9 scale 0.09 }
        finish{ 
            phong 0.1
            roughness 0.4
            ambient .1
            diffuse .2
        }
    }
}   

#declare neck = union {
    cylinder {  // Neck
        <0, -2, 0>, <0, 2, 0>, 0.6
        translate y*10   
    }
    cone {  // Neck bevel
        <0, 0.8, 0>, 0.9 
        <0, -1, 0>, 0.6
        translate y*12
    }
    pigment{ color <0.9, 0.47, 0>}
}



#declare right_eye = difference{
    sphere {
        <0, 0, 0>, 1.2 // <x, y, z>, radius
        translate<1.2, 12.5, -1.2>
    }
    cylinder {  // Right eye
        <0, 0, -1.6>, <0, 0, 1.6>, 2
        translate <1.2, 12.5, -0.5>
    }
    pigment{ color<0, 0, 0> }
    finish{
        diffuse 0.8
        ambient 0.8
        specular .5
        roughness 0.001
        reflection .35
        phong .75
        phong_size 50
    }
}

#declare left_eye = difference{
    sphere {
        <0, 0, 0>, 1.2 // <x, y, z>, radius
        translate<-1.2, 12.5, -1.2>
    }
    cylinder {  // Right eye
        <0, 0, -1.6>, <0, 0, 1.6>, 2
        translate <-1.2, 12.5, -0.5>
    }
    pigment{ color<0, 0, 0> }
    finish{
        diffuse 0.8
        ambient 0.8
        specular .5
        roughness 0.001
        reflection .35
        phong .75
        phong_size 50
    }
}

#declare head = union {
    cylinder {  // Head neck connector
        <0, 0, -1.6>, <0, 0, 1.6>, 0.4
        translate y*12 -z*0.5
    }

    cylinder {  // Head left
        <0, 0, -1.6>, <0, 0, 1.6>, 1.1 
        translate <-1.2, 12.5, -0.5>
    }

    cylinder {  // Head right
        <0, 0, -1.6>, <0, 0, 1.6>, 1.1
        translate <1.2, 12.5, -0.5>
    }

    box {   // Top part of head
        <-1.2, -0.6, -1.6>, <1.2, 0.6, 1.6>
        translate<0, 13, -0.5>
    }
    texture{
        Silver_Metal
    }
    finish{
        ambient 0.01
        diffuse 0.5
        phong 0.2
        roughness 0.03
    }
}

#declare eyes = union {
    object{right_eye}
    object{left_eye}
}

box {   // Left arm
    <-0.5, -0.5, -1.7>, <0.5, 0.5, 3> // <x, y, z> near lower left corner, <x, y, z> far upper right corner
    pigment{ color <0.9, 0.47, 0>}
    rotate <55, 0, 0> // <x°, y°, z°>
    translate<-4, 9, -2>
}

box {   // Right arm
    <-0.5, -0.5, -2.5>, <0.5, 0.5, 3> // <x, y, z> near lower left corner, <x, y, z> far upper right corner
    pigment{ color <0.9, 0.47, 0>}
    rotate <-10, 0, 0> // <x°, y°, z°>
    translate<4, 6.3, -2.4>
}

#declare left_hand = difference{
    torus {
        1, .25 // major radius, minor radius
        scale <0, 5, -1.2>
    }
    cylinder {
        <0, -3, 0>, <0, 3, 0>, 2
        translate <0, 0, -2>
    }
    texture{
        Aluminum
    }
    finish{
        ambient 0.01
        diffuse 0.5
        phong 0.2
        roughness 0.03
    }
    rotate <55, 0, 0>
    translate<-4, 11, -3.8>
}

#declare right_hand = difference{
    torus {
        1, .25 // major radius, minor radius
        scale <0, 5, -1.2>
    }
    cylinder {
        <0, -3, 0>, <0, 3, 0>, 2
        translate <0, 0, -2>
    }
    texture{
        Aluminum
    }
    finish{
        ambient 0.01
        diffuse 0.5
        phong 0.2
        roughness 0.03
    }
    rotate <-10, 0, 0>
    translate<4, 5.8, -5.8>
}

body
treads
neck
head
eyes
left_hand
right_hand


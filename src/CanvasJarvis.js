/* The above code is a JavaScript file that appears to be related to a canvas drawing application using
React. Here is a summary of what the code is doing: */
// Canvas.js


import React, { useRef, useEffect, useState } from 'react';
import './Canvas.css';
import p_ope from './p_right_open.png';
import p_clos from './p_right_close.png';
import cyan_ from './cyan_ghost.png';
import afraid_ from './afraid_ghost.png';

import greenright from './greenright1.png';

import point_added from './point_added.mp3';
import pacmna_death from './pacman_death.wav';
import state_change from './retro-video-game-coin-pickup-38299.mp3';
import siren from './siren-output.mp3';
import pinkright from './pinkright1.png';
import redright from './redright1.png';
import orangeright from './yellowright1.png';
import completeAudio from './die.mp3'
import finishedAudio from './waza.mp3';
import eatingAudio from './eating.mp3'

var ctx;
var canvas;
var currentPoints = [];
var indexOfGhosts = [];

// output
var myConvexHull = []; // outputIndex, points, pairs, pairs, state
var outputindex = 0;
var p_close = new Image();
p_close.src = p_clos;
var p_open = new Image();
p_open.src = p_ope;
var cyan_g = new Image();
cyan_g.src = cyan_;
var afraid_g = new Image();
afraid_g.src = afraid_;
var p_size = 25;
var ghostSize = 20;
var ghostList = [];
var ghostList_in_next = [];
var pacman;
var list1 = [];
var list2 = [];
var hull_list = [];
var f = false;
var flag2 = false;
var flag3 = true;
var idx = 0;
var flag_done_ch = false;

let req1;
let req2;
var textBoxEle = [];
var temp_points = [];
var done = false;
var done2 = false;
var playOnce2 = false;
var playOnce = false;



let audio_siren = new Audio(siren);

/**
 * The Pacman function in JavaScript defines a class for controlling the movement and drawing of a
 * Pacman character on a canvas, including handling orientation, speed reduction, and drawing
 * animations.
 * @param non_hull - The `non_hull` parameter in the `Pacman` function represents a list of points that
 * Pacman will move through. These points define the path that Pacman will follow on the canvas. Each
 * point in the list has an `x` and `y` coordinate representing its position.
 * @param img_open - The `img_open` parameter in the `Pacman` function represents the image that will
 * be displayed when Pacman's mouth is open. This image is used to visually represent Pacman in the
 * game.
 * @param img_close - The `img_close` parameter in the `Pacman` function is used to specify the image
 * that will be displayed when the Pacman character is in a closed mouth state. This image is typically
 * used to represent the Pacman character when it is not actively eating or moving.
 * @param size - The `size` parameter in the Pacman function represents the size of the Pacman
 * character. It is used to determine the dimensions of the Pacman image that will be displayed on the
 * canvas. The `size` parameter is typically a numerical value that specifies the width and height of
 * the Pacman character
 * @returns The code provided defines a constructor function `Pacman` that creates instances of a
 * Pacman object. The Pacman object has properties and methods related to its movement and drawing on a
 * canvas. The constructor function takes parameters such as `non_hull` (an array of points),
 * `img_open` and `img_close` (images for open and closed mouth Pacman), and `size` (
 */
function Pacman(non_hull, img_open, img_close, size) {
    this.non_hull = non_hull.slice();
    list1.reverse();
    list1.pop();
    list1.reverse();
    this.curr_x = this.non_hull[0].x;
    this.curr_y = this.non_hull[0].y;
    this.size = size;
    if (this.non_hull.length > 1) {
        this.next_x = this.non_hull[1].x;
        this.next_y = this.non_hull[1].y;
    }
    else {
        this.next_x = this.non_hull[0].x;
        this.next_y = this.non_hull[0].y;
    }
    this.eqal_x = 0;
    if (this.curr_x === this.next_x) {
        this.eqal_x = 1;
    }
    this.image_open = img_open;
    this.image_close = img_close;
    this.dx = Math.sign(this.next_x - this.curr_x);
    this.slope = Math.sign(this.next_y - this.curr_y);
    if (this.curr_x !== this.next_x) {
        this.slope = (this.next_y - this.curr_y) / (this.next_x - this.curr_x);
    }
    if (this.dx !== 0) {
        this.slope = this.slope * this.dx;
    }
    if (this.curr_x === this.next_x) {
        this.orientation = Math.sign(this.next_y - this.curr_y) * Math.PI / 2;
    }
    this.flag = 0;
    this.count = 0;
    this.index = 1;
    this.set_non_hull = function (non_hull) {
        this.non_hull = non_hull.slice();
        this.next_x = this.non_hull[0].x;
        this.next_y = this.non_hull[0].y;
        this.dx = Math.sign(this.next_x - this.curr_x);
        this.slope = Math.sign(this.next_y - this.curr_y);
        if (this.curr_x !== this.next_x) {
            this.slope = (this.next_y - this.curr_y) / (this.next_x - this.curr_x);
        }
        if (this.dx !== 0) {
            this.slope = this.slope * this.dx;
        }
        this.original_slope = this.slope;
        this.original_dx = this.dx;
        this.orientation = Math.atan(this.slope);
        if (this.curr_x === this.next_x) {
            this.orientation = Math.sign(this.next_y - this.curr_y) * Math.PI / 2;
        }
        this.reduce_speed();
        this.flag = 0;
        this.count = 0;
        this.index = 0;
        if (this.curr_x === this.next_x) {
            this.eqal_x = 1;
        }
        else {
            this.eqal_x = 0;
        }
    }
    this.original_slope = this.slope;
    this.original_dx = this.dx;
    this.reduce_speed = function () {
        while (this.dx >= 0.0001 && (this.slope >= 2 || this.slope <= -2)) {
            this.dx = this.dx / 2;
            this.slope = this.slope / 2;
        }
    }
    this.reduce_speed();
    this.get_position = function () {
        return { x: this.curr_x, y: this.curr_y };
    }

    this.draw_open = function () {
        ctx.save();
        ctx.translate(this.curr_x, this.curr_y);
        var deltaX = this.next_x - this.curr_x;
        var deltaY = this.next_y - this.curr_y;
        var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        ctx.rotate(angle * Math.PI / 180);
        ctx.drawImage(this.image_open, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }

    this.draw_close = function () {
        ctx.save();
        ctx.translate(this.curr_x, this.curr_y);
        var deltaX = this.next_x - this.curr_x;
        var deltaY = this.next_y - this.curr_y;
        var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        ctx.rotate(angle * Math.PI / 180);
        ctx.drawImage(this.image_close, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }

    this.draw_food = function (x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    }

    this.draw_hull = function () {
        ctx.lineWidth = 5;
        for (var i = 0; i < hull_list.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(hull_list[i].x, hull_list[i].y);
            ctx.lineTo(hull_list[i + 1].x, hull_list[i + 1].y);
            ctx.strokeStyle = '#1919A6';
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(hull_list[hull_list.length - 1].x, hull_list[hull_list.length - 1].y);
        ctx.lineTo(this.curr_x, this.curr_y);
        ctx.strokeStyle = '#1919A6';
        ctx.stroke();
    }

    this.update = function () {
        if (f === true && hull_list.length > 1) {
            this.draw_hull();
        }
        this.count++;
        this.curr_x += this.dx;
        this.curr_y += this.slope;

        if (this.eqal_x === 0) {
            if (this.curr_x !== this.next_x) {
                for (var i = this.curr_x; i !== this.next_x; i += (10 * this.original_dx)) {
                    if (Math.abs(i) < canvas.width) {
                    } else {
                        break;
                    }
                    if (this.original_dx === 1 && i > this.next_x) {
                        break;
                    }
                    else if (this.original_dx === -1 && i < this.next_x) {
                        break;
                    }
                    this.draw_food(i, this.curr_y + (i - this.curr_x) * this.original_slope * this.original_dx);
                }
            }
            if (this.index === this.non_hull.length - 1 && this.curr_x === this.next_x) {
                this.curr_x = this.next_x;
                this.curr_y = this.next_y;
                this.dx = 0;
                this.slope = 0;
                if (f === true) {
                    hull_list.push(list2[0]);
                }
                list1.reverse();
                list1.pop();
                list1.reverse();
                this.draw_close();
            }
            else if (this.curr_x === this.next_x) {
                this.curr_x = this.next_x;
                this.curr_y = this.next_y;
                this.next_x = this.non_hull[this.index + 1].x;
                this.next_y = this.non_hull[this.index + 1].y;
                this.dx = Math.sign(this.next_x - this.curr_x);
                this.slope = Math.sign(this.next_y - this.curr_y);
                if (this.curr_x !== this.next_x) {
                    this.slope = (this.next_y - this.curr_y) / (this.next_x - this.curr_x);
                }
                if (this.dx !== 0) {
                    this.slope = this.slope * this.dx;
                }
                this.original_slope = this.slope;
                this.original_dx = this.dx;
                this.reduce_speed();
                this.flag = 0;
                if (this.curr_x === this.next_x) {
                    this.eqal_x = 1;
                }
                else {
                    this.eqal_x = 0;
                }
                this.orientation = Math.atan(this.slope);
                if (this.curr_x === this.next_x) {
                    this.orientation = Math.sign(this.next_y - this.curr_y) * Math.PI / 2;
                }
                this.count = 0;
                this.index++;
                this.draw_close();
            }
            else if (this.flag === 0) {
                this.draw_close();
                if (this.count === 15) {
                    this.flag = 1;
                    this.count = 0;
                }
            }
            else {
                this.draw_open();
                if (this.count === 15) {
                    this.flag = 0;
                    this.count = 0;
                }
            }
            if (list1.length > 1 && this.curr_x === list1[0].x) {
                if (f === true) {
                    hull_list.push(list2[0]);
                }
                list1.reverse();
                list1.pop();
                list1.reverse();
            }
        }
        else {
            if (this.curr_y !== this.next_y) {
                for (var itr = this.curr_y; itr !== this.next_y; itr += (10 * this.original_slope)) {
                    if (Math.abs(itr) > canvas.height) {
                        break;
                    }
                    if (this.original_slope === 1 && itr > this.next_y) {
                        break;
                    }
                    else if (this.original_slope === -1 && itr < this.next_y) {
                        break;
                    }
                    this.draw_food(this.curr_x, itr);
                }
            }
            if (this.index === this.non_hull.length - 1 && this.curr_y === this.next_y) {
                this.curr_x = this.next_x;
                this.curr_y = this.next_y;
                this.dx = 0;
                this.slope = 0;
                if (f === true) {
                    hull_list.push(list2[0]);
                }
                list1.reverse();
                list1.pop();
                list1.reverse();
                this.draw_close();
            }
            else if (this.curr_y === this.next_y) {
                this.curr_x = this.next_x;
                this.curr_y = this.next_y;
                this.next_x = this.non_hull[this.index + 1].x;
                this.next_y = this.non_hull[this.index + 1].y;
                this.dx = Math.sign(this.next_x - this.curr_x);
                this.slope = Math.sign(this.next_y - this.curr_y);
                if (this.curr_x !== this.next_x) {
                    this.slope = (this.next_y - this.curr_y) / (this.next_x - this.curr_x);
                }
                if (this.dx !== 0) {
                    this.slope = this.slope * this.dx;
                }
                this.original_slope = this.slope;
                this.original_dx = this.dx;
                this.reduce_speed();
                this.flag = 0;
                if (this.curr_x === this.next_x) {
                    this.eqal_x = 1;
                }
                else {
                    this.eqal_x = 0;
                }
                this.orientation = Math.atan(this.slope);
                if (this.curr_x === this.next_x) {
                    this.orientation = Math.sign(this.next_y - this.curr_y) * Math.PI / 2;
                }
                this.count = 0;
                this.index++;
                this.draw_close();
            }
            else if (this.flag === 0) {
                this.draw_close();
                if (this.count === 15) {
                    this.flag = 1;
                    this.count = 0;
                }
            }
            else {
                this.draw_open();
                if (this.count === 15) {
                    this.flag = 0;
                    this.count = 0;
                }
            }
            if (list1.length > 1 && this.curr_y === list1[0].y) {
                if (f === true) {
                    hull_list.push(list2[0]);
                }
                list1.reverse();
                list1.pop();
                list1.reverse();
            }
        }
    }

}

/**
 * The Ghost function defines a JavaScript object representing a ghost character that moves between
 * specified points on a canvas while reducing its speed and updating its position accordingly.
 * @param x - The `x` parameter in the `Ghost` function represents the initial x-coordinate of the
 * ghost's position on the canvas. It determines where the ghost will be initially placed horizontally.
 * @param y - It seems like the description of the parameters is cut off. Could you please provide more
 * information about the parameters starting from "y:" so that I can assist you better?
 * @param next_x - It seems like your message got cut off after "next_x:". Could you please provide
 * more information on what you need help with regarding the "next_x" parameter in the Ghost function?
 * @param next_y - The `next_y` parameter in the `Ghost` function represents the y-coordinate of the
 * next position where the ghost will move to. It is used to determine the direction and speed at which
 * the ghost will move towards that position.
 * @param image - The `image` parameter in the `Ghost` function represents the image that will be used
 * to draw the ghost object on the canvas. It is the visual representation of the ghost character in
 * the game or application. This image could be a sprite, a PNG, a JPEG, or any other image format
 * @param size - The `size` parameter in the `Ghost` function represents the size of the ghost object.
 * It is used to determine the dimensions of the ghost when drawing it on the canvas. The `size`
 * parameter is used to calculate the position and dimensions of the ghost image within the canvas.
 * @returns The code provided defines a constructor function called `Ghost` that creates ghost objects
 * with specific properties and methods. The `Ghost` function takes in parameters for initial x and y
 * coordinates, next x and y coordinates, an image, and size.
 */
function Ghost(x, y, next_x, next_y, image, size) {
    this.x = x;
    this.y = y;
    this.initial_x = x;
    this.initial_y = y;
    this.size = size;
    this.next_x = next_x;
    this.next_y = next_y;
    this.image = image;
    this.dx = Math.sign(this.next_x - this.initial_x);
    this.slope = Math.sign(this.next_y - this.initial_y);
    if (this.initial_x !== this.next_x) {
        this.slope = (this.next_y - this.initial_y) / (this.next_x - this.initial_x);
    }
    this.reduce_speed = function () {
        while (this.dx >= 0.0001 && (this.slope >= 2 || this.slope <= -2)) {
            this.dx = this.dx / 2;
            this.slope = this.slope / 2;
        }
    }
    this.reduce_speed();
    this.get_position = function () {
        return { x: this.x, y: this.y };
    }
    this.draw = function () {
        ctx.drawImage(this.image, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
    this.update = function () {
        if (this.initial_x !== this.next_x) {
            if (this.initial_x < this.next_x) {
                if (this.x >= this.next_x) {
                    this.dx = -this.dx;
                    this.x = this.next_x;
                    this.y = this.next_y;
                }
                else if (this.x <= this.initial_x) {
                    this.dx = -this.dx;
                    this.x = this.initial_x;
                    this.y = this.initial_y;
                }
            }
            else {
                if (this.x <= this.next_x) {
                    this.dx = -this.dx;
                    this.x = this.next_x;
                    this.y = this.next_y;
                }
                else if (this.x >= this.initial_x) {
                    this.dx = -this.dx;
                    this.x = this.initial_x;
                    this.y = this.initial_y;
                }
            }
            if (this.initial_y < this.next_y) {
                if (this.y >= this.next_y) {
                    this.slope = -this.slope;
                    this.y = this.next_y;
                }
                else if (this.y <= this.initial_y) {
                    this.slope = -this.slope;
                    this.y = this.initial_y;
                }
            }
            else {
                if (this.y < this.next_y) {
                    this.slope = -this.slope;
                    this.y = this.next_y;
                }
                else if (this.y > this.initial_y) {
                    this.slope = -this.slope;
                    this.y = this.initial_y;
                }
            }
        }
        else {
            // if points have same x coordinate
            if (this.initial_y < this.next_y) {
                if (this.y >= this.next_y) {
                    this.slope = -this.slope;
                    this.y = this.next_y;
                }
                else if (this.y <= this.initial_y) {
                    this.slope = -this.slope;
                    this.y = this.initial_y;
                }
            }
            else {
                if (this.y < this.next_y) {
                    this.slope = -this.slope;
                    this.y = this.next_y;
                }
                else if (this.y > this.initial_y) {
                    this.slope = -this.slope;
                    this.y = this.initial_y;
                }
            }
        }
        this.x += this.dx;
        this.y += this.slope;
        this.draw();
    }

}

/**
 * The `draw` function in JavaScript updates the game canvas by clearing it, drawing elements such as
 * circles in different colors, updating ghost positions, and handling game logic based on the
 * positions of game elements.
 * @returns In the provided code snippet, the `draw` function is returning nothing explicitly. The
 * function contains conditional statements and loops to draw shapes on a canvas based on the data in
 * `list1`, `list2`, and `ghostList`. The function also updates the positions of objects like `pacman`
 * and `ghostList`. At the end of the function, there are conditional checks and a `return
 */
function draw() {
    req1 = requestAnimationFrame(draw);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(ghostList.length - list2.length >= 1) {
        ghostList.shift();
    }
    if(ghostList.length !== 0 && f === true) {
        var ghost_pos = ghostList[0].get_position();
        var pacman_pos = pacman.get_position();
        if(Math.abs(ghost_pos.x - pacman_pos.x) < 2 && Math.abs(ghost_pos.y - pacman_pos.y) < 2) {
            ghostList.reverse();
            ghostList.pop();
            ghostList.reverse();
        }
    }
    for(var itr = 0; itr < list2.length; itr++) {
        ctx.beginPath();
        ctx.arc(list2[itr].x, list2[itr].y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
    }
    for(var i = 0; i < list1.length; i++) {
        ctx.beginPath();
        ctx.arc(list1[i].x, list1[i].y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();
    }
    for(var i = 0; i < ghostList.length; i++) {
        ghostList[i].update();
    }
    if(list1.length > 0) {
        pacman.update();
    }
    else if(list2.length === 0) {
        if(ghostList.length > 0) {
            ghostList.shift();
        }
        pacman.draw_hull();
        console.log("FINISH draw hull call");
        done = false;
        done2 = true;
        let complete = new Audio(completeAudio);
        complete.play();
        cancelAnimationFrame(req1);
        return;
    }
    else {
        f = true;
        list1 = list2;
        hull_list.push(list2[0]);
        pacman.image_open = p_open;
        pacman.image_close = p_close;
        for(var i = 0; i < ghostList.length; i++) {
            ghostList[i].image = afraid_g;
        }
        pacman.set_non_hull(list1);
    }
}

/**
 * The function `draw_in_next` in JavaScript draws convex hull points, pairs, and noncandidates with
 * different colors and handles the animation of ghost objects based on certain conditions.
 */
let colorList = [];
var ghostList_in_next = [];
var flag3 = true;

function draw_in_next(){
    req2 = requestAnimationFrame(draw_in_next);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var index = idx;
    var pts = myConvexHull[index].points;
    const pairs = myConvexHull[index].pairs;
    const state = myConvexHull[index].state;
    const slope = myConvexHull[index].slope;
    const noncandidates = myConvexHull[index].noncandidates;
    // display pairs
    if(pairs !== null && pairs.length !== 1)
    {
        ctx.beginPath();
        ctx.moveTo(pairs[0].x, pairs[0].y);
        ctx.lineTo(pairs[1].x, pairs[1].y);
        for (let i = 1; i < pairs.length - 1; i++) {
            ctx.moveTo(pairs[i].x, pairs[i].y);
            ctx.lineTo(pairs[i+1].x, pairs[i+1].y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'red';
        ctx.stroke();
    }

    if(pairs !== null && pairs.length !== 1 && flag3 === true){
        var found = false;
        for (var i = 0; i < indexOfGhosts.length; i++) {
            if (indexOfGhosts[i] === index) {
                found = true;
                break;
            }
        }
        if (found === false) {
            indexOfGhosts.push(index);
        }

        // this is to avoid the same ghost to be added again
        for (var i = 0; i < ghostList_in_next.length; i++) {
            if (pairs[0].x === ghostList_in_next[i].initial_x && pairs[0].y === ghostList_in_next[i].initial_y && pairs[1].x === ghostList_in_next[i].next_x && pairs[1].y === ghostList_in_next[i].next_y) {
                // ghostList_in_next.splice(i, 1);
                break;
            }
        }
        var myGhost = new Image();
        var randInt = Math.floor(Math.random() * 4);
        if (randInt === 0) {
            myGhost.src = greenright;
        }
        else if (randInt === 1) {
            myGhost.src = pinkright;
        }
        else if (randInt === 2) {
            myGhost.src = redright;
        }
        else {
            myGhost.src = orangeright;
        }
        if(ghostList_in_next.length === 0){
            console.log("pushing new ghost 1");
            ghostList_in_next.push(new Ghost(pairs[0].x, pairs[0].y, pairs[1].x, pairs[1].y, myGhost, 20));
            colorList.push({color: randInt, curr_x: pairs[0].x, curr_y: pairs[0].y, next_x: pairs[1].x, next_y: pairs[1].y});
            console.log(ghostList_in_next.length)
        }else{
            let len = ghostList_in_next.length;
            let pair_len = pairs.length;
            if((ghostList_in_next[len - 1].initial_x !== pairs[pair_len-2].x && ghostList_in_next[len - 1].initial_y !== pairs[pair_len-2].y) || (ghostList_in_next[len - 1].next_x !== pairs[pair_len - 1].x && ghostList_in_next[len - 1].next_y !== pairs[pair_len - 1].y)){
                console.log("pushing new ghost 2");
                ghostList_in_next.push(new Ghost(pairs[pair_len - 1-1].x, pairs[pair_len - 2].y, pairs[pair_len - 1].x, pairs[pair_len - 1].y, myGhost, 20)); 
                colorList.push({color: randInt, curr_x: pairs[pair_len - 1-1].x, curr_y: pairs[pair_len - 1-1].y, next_x: pairs[pair_len - 1].x, next_y: pairs[pair_len - 1].y});
            }
        }

        flag3 = false;
    }

    if(state === 'leftmost_point')
    {
        ctx.save();
        ctx.fillStyle = 'yellow';
        ctx.arc(noncandidates.x, noncandidates.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }


    if (pts !== null) {
        pts.forEach(point => {
            if(((state === 'leftmost_point' || state === 'orientation_counter_clock' || state === 'orientation_clock') && (point.x === noncandidates.x && point.y === noncandidates.y)))
            {

            }
            else
            {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
                ctx.fillStyle = "#00ff00";
                ctx.fill();
                ctx.closePath();
            }
        });
    }

    if (noncandidates !== null && noncandidates.length === 3) {
        // Draw points
        noncandidates.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
            ctx.fillStyle = 'yellow';
            ctx.fill();
            ctx.closePath();
        });
    
        // Draw lines
        ctx.beginPath();
        ctx.moveTo(noncandidates[0].x, noncandidates[0].y); 
        ctx.lineTo(noncandidates[2].x, noncandidates[2].y); 
        ctx.lineTo(noncandidates[1].x, noncandidates[1].y);
        ctx.strokeStyle = 'blue'; 
        ctx.stroke(); 
        ctx.closePath();
    }
    



    if (noncandidates !== null && noncandidates.length === 1) {
            ctx.beginPath();
            ctx.arc(noncandidates.x, noncandidates.y, 10, 0, 2 * Math.PI);
            ctx.fillStyle = 'yellow';
            ctx.fill();
            ctx.closePath();
    }


    if(state === 'hull')
    {
        // make lines of points
        audio_siren.pause();

        console.log("hull ... ");

        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for(var i = 0; i < pts.length - 1; i++)
        {
            ctx.lineTo(pts[i+1].x, pts[i+1].y);
        }
        ctx.lineTo(pts[0].x, pts[0].y);
        ctx.closePath();
        ctx.stroke();
        cancelAnimationFrame(req2);
        
        // done fore previous button
        hull_list = [];

        var hull = pts.slice();
        list2 = hull.slice();
        let noncandidates = temp_points.filter(point => !hull.includes(point));
        console.log("temp_points", temp_points);
        console.log("hull", hull);
        for(let i = 0; i < noncandidates.length; i++)
        {
            list1.push(noncandidates[i]);
        }

        for (let k = 0; k < list1.length; k++) {
            let minpoint = {x: ctx.canvas.width, y: ctx.canvas.height};
            let minvalue = Infinity;            
            for(let j = k + 1; j < list1.length; j++) {
                if((list1[j].x - list1[k].x) ** 2 + (list1[j].y - list1[k].y) ** 2 < minvalue) {
                    minvalue = (list1[j].x - list1[k].x) ** 2 + (list1[j].y - list1[k].y) ** 2;
                    minpoint = list1[j];
                    list1[j] = list1[k + 1];
                    list1[k + 1] = minpoint;
                }
            }
        }

        list2.push(hull[0]);
        console.log("non candidates", noncandidates);
        console.log("list 1 is here ", list1);
        console.log("list 2 is here ", list2);
        console.log("ghost list in next , length", ghostList_in_next, ghostList_in_next.length);
        for (var itr = 0; itr < list2.length - 1; itr++) {
            var myGhost = new Image();
            var randInt = -1;
            var curr_x, curr_y, next_x, next_y;
            for(var i = 0; i < colorList.length; i++){
                if(list2[itr].x === colorList[i].curr_x && list2[itr].y === colorList[i].curr_y){
                    randInt = colorList[i].color;
                    break;
                }
            }
            console.log("randInt ->", randInt);
            if (randInt === 0) {
                myGhost.src = greenright;
            }
            else if (randInt === 1) {
                myGhost.src = pinkright;
            }
            else if (randInt === 2) {
                myGhost.src = redright;
            }
            else {
                myGhost.src = orangeright;
            }

            ghostList.push(new Ghost(list2[itr].x, list2[itr].y, list2[itr + 1].x, list2[itr + 1].y, myGhost, 20));
        }
        if (list1.length > 0) {
            pacman = new Pacman(list1, p_open, p_close, 25);
            console.log("pacman", pacman.curr_x, pacman.curr_y);
            console.log("pacman", pacman);
        } else {
            pacman = new Pacman(list2, p_open, p_close, 25);
        }
        req1 = requestAnimationFrame(draw);
    }
    if (indexOfGhosts.length > 0 && ghostList_in_next.length > 0 && indexOfGhosts[indexOfGhosts.length - 1] > index && flag2 === true) {
        console.log("index & indexOfGhosts[indexOfGhosts.length - 1]", index, indexOfGhosts[indexOfGhosts.length - 1])
        console.log(indexOfGhosts);
        indexOfGhosts.pop();
        ghostList_in_next.pop();
        flag2 = false;
    }
    for (var i = 0; i < ghostList_in_next.length; i++) {
        ctx.beginPath();
        ctx.arc(ghostList_in_next[i].initial_x, ghostList_in_next[i].initial_y, 5, 0, 2 * Math.PI);
        ctx.arc(ghostList_in_next[i].next_x, ghostList_in_next[i].next_y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'violet';
        ctx.fill();
        ctx.closePath();
        ghostList_in_next[i].update();
    }
}



// ConvexHull.js
/* The class ConvexHull implements an algorithm to find the convex hull of a set of points using Jarvis
March method. */
/* The ConvexHull class in JavaScript implements the Jarvis March algorithm to find the convex hull of
a set of points. */
class ConvexHull {
    constructor(points) {
        this.points = points;
    }

    findConvexHull() {
        temp_points = this.points.slice();
        if (this.points.length <= 1) return this.points;

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        const orientation = (p, q, r) => {
            let val = (q.y - p.y) * (r.x - q.x) -
            (q.x - p.x) * (r.y - q.y);
            
            if (val === 0) {
                return 0;
            }
            return (val > 0) ? 1 : 2;
        }
        
        const findHull = (points) => {

            console.log("I am in Jarvis march");
            shuffle(points);
            console.log(points);
            myConvexHull.push({state: outputindex++, points: points, pairs: null, slope: null, state: 'initial_points', noncandidates: null});
            textBoxEle.push("Initial points are: ");
            let hull = [];
            let n = points.length;

            let left = 0;
            for (let i = 1; i < n; i++) {
                if (points[i].x < points[left].x) {
                    left = i;
                }
            }
            myConvexHull.push({state: outputindex++, points: points, pairs: null, slope: null, state: 'leftmost_point', noncandidates: points[left]});
            textBoxEle.push("Computing the leftmost point.")

            let p = left, q;
            do {
                hull.push(points[p]);
                q = (p + 1) % n;

                for (let i = 0; i < n; i++) {
                    if (orientation(points[p], points[i], points[q]) === 2)
                    {
                        q = i;
                        myConvexHull.push({state: outputindex++, points: points, pairs: hull.slice(), slope: null, state: 'orientation_counter_clock', noncandidates: [points[p], points[i], points[q]]});
                        textBoxEle.push("Current smallest polar angle relative to the current point on the hull.")
                    }
                    else
                    {
                        myConvexHull.push({state: outputindex++, points: points, pairs: hull.slice(), slope: null, state: 'orientation_clock', noncandidates: [points[p], points[i], points[q]]});
                        textBoxEle.push("For each point computing the polar angle with the current point on the hull.")

                    }
                }
                p = q;

            } while (p !== left);
            console.log(hull);
            myConvexHull.push({state: outputindex++, points: hull, pairs: hull, slope: null, state: 'hull', noncandidates: null});
            textBoxEle.push("Final Hull Computed.")
            console.log("no of states : ", myConvexHull.length);
            return hull;
        }


        const hull = findHull(this.points);
        return hull;
    }
}

/**
 * The Canvas component in JavaScript allows users to interact with a canvas element, draw points,
 * create a convex hull, navigate through steps, and add points using x, y coordinates.
 * @returns The `Canvas` component is being returned. It contains a canvas element for drawing points
 * and convex hulls, along with buttons for navigation and interaction. The component also includes
 * input fields for adding points and a textarea for displaying steps. The component handles mouse
 * events, keyboard events, and animations for displaying the convex hull algorithm steps.
 */
const Canvas = () => {
    const canvasRef = useRef(null);
    const [finished, setFinished] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [textBoxValue, setTextBoxValue] = useState('');
    const [pointsInput, setPointsInput] = useState('');
    var [randomNo, setRandomInput] = useState('');
    var [points, setPoints] = useState([]);
    var [val, setVal] = useState(0);
    const keysPressed = useRef({});
    const inputRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    let audio = new Audio(finishedAudio);
    let audio2 = new Audio(eatingAudio);


    useEffect(() => {
        // Start playing the audio when component mounts
        setIsPlaying(true);
    
        // Cleanup function to stop audio when component unmounts
        return () => {
          setIsPlaying(false);
        };
      }, []);


      useEffect(() => {
        const playAudioLoop = async () => {
          while (done === true && done2 === false && playOnce2 === false) {
            playOnce2 = true;
            try{
                await audio.play(); // Start playing audio
                await new Promise(resolve => setTimeout(resolve, audio.duration * 1000)); // Wait until audio finishes
                audio.currentTime = 0; // Reset audio to the beginning
            } catch (err) {
                console.log("Audio play failed .... ", err);
            }
            finally{
                playOnce2 = false;
            }
          }
        };
        if(done === true && done2 === false)
        {
            playAudioLoop();
        }
        return () => {
          audio.pause();
          audio.currentTime = 0;
        };
        }, [done, done2, audio, playOnce2]);


        useEffect(() => {
        const playAudioLoop2 = async () => {
            while (done === true && done2 === false && playOnce === false) { 
            playOnce = true;
            try{
              await audio2.play();
              await new Promise(resolve => setTimeout(resolve, audio2.duration * 1000)); // Wait until audio finishes
              audio2.currentTime = 0; // Reset audio to the beginning
            } catch (err) {
                console.log("Audio play failed .... ", err);
            }
            finally{
                playOnce = false;
            }
            }
          };
          if(done === true && done2 === false && playOnce === false)
          {
              playAudioLoop2();
          }
            return () => {
                audio2.pause();
                audio2.currentTime = 0;
            };
        }, [done, done2, audio2, playOnce]);

    useEffect(() => {
        canvas = canvasRef.current;
        ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw convex hull
        if (finished) {
            const convexHull = new ConvexHull(points).findConvexHull();
            console.log(myConvexHull);
            points = convexHull;
            ctx.beginPath();
            ctx.moveTo(convexHull[0].x, convexHull[0].y);
            for (let i = 1; i < convexHull.length; i++) {
                ctx.lineTo(convexHull[i].x, convexHull[i].y);
            }
            ctx.closePath();
            ctx.strokeStyle = 'red';
            ctx.stroke();
        }

        // Draw points
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "#00ff00";
            ctx.fill();
        });

    }, [points, finished]);

    const handleAddPoint = () => {
        var [x, y] = pointsInput.split(',').map(coord => parseFloat(coord.trim()));

        [x, y] = [Math.floor(x), Math.floor(y)];

        if (!isNaN(x) && !isNaN(y) && x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
            setPoints([...points, { x, y }]);
            setPointsInput('');
            inputRef.current.focus();
            let audio = new Audio(point_added);
            audio.currentTime = 0.2;
            audio.play();
        } else {
            alert('Invalid input. Please enter valid coordinates in the format "x, y".');
        }
    };

    let audio_addpt = new Audio(point_added);
    const handleCanvasClick = (event) => {
        if (!finished) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            x = Math.floor(x);
            y = Math.floor(y);
            audio_addpt.currentTime = 0.2;
            audio_addpt.play();
            setPoints(prevPoints => [...prevPoints, { x, y }]);
        }
    };

    const handleFinishClick = async () => {
        if(points.length === 0)
        {
            alert('Please add points to the canvas before finishing');
            return;
        }
        else
        {
            setFinished(true);
        }
        audio_siren.volume = 0.5;
        audio_siren.play();
    };

    const delay = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const handleSkip = async () => {
        let temp = val;
        for (let itr = temp; itr < myConvexHull.length - 1; itr++) {
            handleNext();
            val++;
            await delay(500); // Wait for 0.5 seconds
        }
        if (val === myConvexHull.length - 1) {
            await delay(1000000000);
        }
    }
    const handlePointsInputChange = (e) => {
        setPointsInput(e.target.value);
      };
    
      const handleRandomSize = (e) => {
        setRandomInput(e.target.value);
    }

    const clearCanvas = () => {
        setPoints([]);
        let audio = new Audio(pacmna_death);
        audio.play();
        setFinished(false);
    };

    const handleNext = () => {
        console.log("val", val);
        done = false;
        var index = val < myConvexHull.length - 1 ? val + 1 : val;
        // val++;
        setVal(index);
        console.log("val", val);
        console.log(index);
        console.log(myConvexHull[index]);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        
        // Draw convex hull
        if (finished) {
            let audio = new Audio(state_change);
            audio.play();

            if (req2 != null) {
                cancelAnimationFrame(req2);
            }

            if(myConvexHull[index].state === 'hull') {
                done = true;
            }

            flag3 = true;
            idx = index;
            setTextBoxValue(textBoxEle[index]);
            req2 = requestAnimationFrame(draw_in_next);
        }
    };

    

    const handlePrev = () => {
        var index = val > 0 ? val - 1 : 0;
        done = false;
        done2 = false;
        setVal(index);
        console.log(index);
        console.log(myConvexHull[index]);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw convex hull

        if (finished) {
            let audio = new Audio(state_change);
            audio.play();
            if (req2 != null) {
                cancelAnimationFrame(req2);
            }
            flag3 = true;
            flag2 = true;
            idx = index;
            setTextBoxValue(textBoxEle[index]);
            req2 = requestAnimationFrame(draw_in_next);
        }
    };


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'q') {
                let no = randomNo;
                const newPoints = [];
                console.log(" ->> ", typeof(randomNo));
                if(randomNo === '')
                {
                    no = 5; 
                }
                while (newPoints.length < no) {
                    const x_in = Math.floor(Math.random() * (canvasRef.current.width - 10));
                    const y_in = Math.floor(Math.random() * (canvasRef.current.height - 10));
                    let x = Math.floor(x_in);
                    let y = Math.floor(y_in);
                    if(x  < 10)
                    {
                        x += 10;
                    }
                    if(y < 10)
                    {
                        y += 10;
                    }
                    if (!newPoints.some(point => point.x === x && point.y === y)) {
                        newPoints.push({ x, y });
                    }
                }
                setPoints(prevPoints => [...prevPoints, ...newPoints]);
            }

            let fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);

            fileInput.addEventListener('change', (event) => {
                let file = event.target.files[0];
                let reader = new FileReader();
                reader.onload = (event) => {
                    let lines = event.target.result.split('\n');
                    let newPoints = lines.map(line => {
                        let [x, y] = line.split(',');
                        return {x: Math.floor(parseFloat(x)), y: Math.floor(parseFloat(y))};
                    });
                    // Set the points

                    setPoints(points => [...points, ...newPoints]);
                };
                reader.readAsText(file);

            });

            if(event.key === 'f'){
                fileInput.click();
            }

            if(finished) {
                if(event.key === 'ArrowRight') {

                    handleNext();
                }
                else if(event.key === 'ArrowLeft') {
                    handlePrev();
                }
                else if(event.key === 's') {
                    let itr = val;
                    for(let i = itr + 1; i < myConvexHull.length; i++) {
                        handleNext();
                        val++;
                        if(myConvexHull[i].state === 'orientation_counter_clock') {
                            break;
                        }
                    }
                }
                else if(event.key === 'h') {
                    let itr = val;
                    for(let i = itr; i < myConvexHull.length; i++) {
                        handleNext();
                        val++;
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleNext, handlePrev, finished, val]);

    return (
        <div>
            <h1 className='kpstext'> Jarvis' March </h1>
            <div>
            <canvas className="canvascss"            
                ref={canvasRef}
                width={1600}
                height={550}
                onClick={handleCanvasClick}
                style={{ cursor: 'crosshair' }}
            />
            </div>
            <br />
            <button
                className={`btns buttons prev-button 'opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-blue-400 to-green-500 hover:from-blue-500 hover:to-green-600'} text-white font-semibold py-2 px-2 rounded-full shadow-md flex items-center justify-center transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                onClick={handleFinishClick}
            >
                <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ width: '25px', height: '25px' }}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={5}
                        fill="currentColor"
                        d="M5 3l14 9-14 9V3z"
                    />
                </svg>
            </button>

            <button
                className={`btns buttons prev-button bg-gradient-to-r from-blue-400 to-green-500 hover:from-blue-500 hover:to-green-600 text-white font-semibold py-2 px-2 rounded-full shadow-md flex items-center justify-center transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                onClick={handleSkip}
            >
                <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ width: '25px', height: '25px' }}
                >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" fill="currentColor" />
                </svg>
            </button>
            <button
                className="btns buttons prev-button bg-gradient-to-r from-blue-400 to-green-500 hover:from-blue-500 hover:to-green-600 text-white font-semibold py-2 px-2 rounded-full shadow-md flex items-center justify-center transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={handlePrev}
            >
                <svg
                    className="w-6 h-6 transform rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ width: '25px', height: '25px' }}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={5}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>

            <button
                className="btns buttons prev-button bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-2 px-2 rounded-full shadow-md flex items-center justify-center transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={handleNext}
            >
                <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ width: '25px', height: '25px' }}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={5}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>
            <button
                className={`btns buttons prev-button bg-gradient-to-r from-blue-400 to-green-500 hover:from-blue-500 hover:to-green-600 text-white font-semibold py-2 px-2 rounded-full shadow-md flex items-center justify-center transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                onClick={clearCanvas}
                disabled={finished}
            >
                <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ width: '25px', height: '25px' }}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={5}
                        d="M10 3 h4 M3 6 h18 M6 6 l2 14 M10 6 v13 M12 6 v13 M14 6 v13 M18 6 l-2 14 M8 23 h8"
                    />
                </svg>
            </button>


            <div className='input-container' style={{fontFamily: "'Press Start 2P', cursive"}}>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter x, y"
                    color="white"
                    value={pointsInput}
                    onChange={handlePointsInputChange}
                    className="centered-input"
                />
                <button className='buttons add-button textclass' onClick={handleAddPoint}>ADD</button>
            <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter target score"
                    color="white"
                    value={randomNo}
                    onChange={handleRandomSize}
                    className="centered-input"
            />
            </div>
            <div className="textbox-container">
                <textarea
                    readOnly
                    className="custom-textbox"
                    value={textBoxValue}
                    placeholder="Click on canvas to add points"
                    rows={6}
                    cols={50}
                />
            </div>
        </div>
    );
};


/* The above code is a JavaScript export statement exporting a class or object named Canvas. */
export default Canvas;

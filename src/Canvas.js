/* The above code appears to be a JavaScript file that is importing various images and audio files for
a game development project. It also seems to be setting up a canvas element using React for
rendering graphics. The code initializes variables for images of different game elements such as
ghosts, pacman, and points. It also defines functions and variables related to game logic, such as
handling points, ghosts, and player movements. */
// Canvas.js
import React, { useRef, useEffect, useState } from 'react';
import './Canvas.css';
import p_ope from './p_right_open.png';
import p_clos from './p_right_close.png';
import greenright from './greenright1.png';
import afraid_ from './afraid_ghost.png';
import point_added from './point_added.mp3';
import pacmna_death from './pacman_death.wav';
import state_change from './retro-video-game-coin-pickup-38299.mp3';
import siren from './siren-output.mp3';
import pinkright from './pinkright1.png';
import redright from './redright1.png';
import orangeright from './yellowright1.png';
import finishedAudio from './waza.mp3';
import eatingAudio from './eating.mp3'
import 'tailwindcss/tailwind.css';
import eatGhostAudio from './ghost-eaten.mp3';
import completeAudio from './die.mp3';


var ctx;
var canvas;
var currentPoints = [];
var indexOfGhosts = [];

// output
var myConvexHull = [];
var textBoxEle = [];
var outputindex = 0;

var ctx;
var p_close = new Image();
p_close.src = p_clos;
var p_open = new Image();
p_open.src = p_ope;
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
var text;
var ghost_coordinates = [];
let req1;
let req2;
var done = false;
var done2 = false;

var playOnce2 = false;
var playOnce = false;

let audio_siren = new Audio(siren);

/**
 * The Pacman function in JavaScript controls the movement and animation of a Pacman character on a
 * canvas, including handling its orientation, speed, and drawing open and close mouth animations.
 * @param non_hull - Non_hull is an array of points representing the path that Pacman will follow. Each
 * point has x and y coordinates.
 * @param img_open - The `img_open` parameter in the `Pacman` function represents the image that will
 * be displayed when Pacman's mouth is open. This image is used in the `draw_open` method of the
 * `Pacman` object to visually represent Pacman with its mouth open.
 * @param img_close - The `img_close` parameter in the `Pacman` function is used to specify the image
 * that will be displayed when the Pacman character is in a closed state. This image is drawn on the
 * canvas when the Pacman character is not moving or when it is in a closed position.
 * @param size - The `size` parameter in the `Pacman` function represents the size of the Pacman
 * character. It is used to determine the dimensions of the Pacman image that will be displayed on the
 * canvas. The `size` parameter is typically a numerical value that specifies the width and height of
 * the Pac
 * @returns The code provided defines a constructor function `Pacman` that creates instances of a
 * Pacman object. The Pacman object has properties and methods related to its movement and drawing on a
 * canvas. The function does not explicitly return anything as it is a constructor function used to
 * create instances of Pacman objects.
 * @namespace Pacman_complete
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
/**  The above code is a JavaScript function that sets properties related to non-hull points for a
certain object. Here is a breakdown of what the code is doing: 
* @memberof Pacman_complete
*/
    this.set_non_hull = function (non_hull) {
        this.non_hull = non_hull.slice();
        this.next_x = this.non_hull[0].x;
        this.next_y = this.non_hull[0].y;
        this.dx = Math.sign(this.next_x - this.curr_x);
        this.slope = Math.sign(this.next_y - this.curr_y);
        if (this.curr_x != this.next_x) {
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
/**  The above code is a JavaScript function that is responsible for drawing an image on a canvas. Here
is a breakdown of what the code is doing: 
*@memberof Pacman_complete
*/

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

/**  The above JavaScript code defines a method called `draw_close` that is responsible for drawing an
image at a specified position and orientation on a canvas. Here's a breakdown of what the code is
doing:
*
* @memberof Pacman_complete
 */
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

/**  The above code is a JavaScript function that draws a small black circle representing food on a
canvas at the specified coordinates (x, y). The function uses the HTML5 Canvas API to draw the
circle using the `arc` method and fills it with a black color. The function is part of an object or
class, as indicated by the use of `this`, and is likely used in a game or simulation to display food
items.
* @memberof Pacman_complete 
*/
    this.draw_food = function (x, y) {
        ctx.beginPath();
        // console.log("in draw food: ", x, y);
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }

/**  The above code is a JavaScript function that is responsible for drawing a hull based on a list of
points (`hull_list`) and the current position (`this.curr_x`, `this.curr_y`).
* @memberof Pacman_complete 
*/
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

/** 
 *  The above code is a JavaScript function that appears to be updating the position of an object on a
canvas. Here is a breakdown of what the code is doing:
* @memberof Pacman_complete 
*/
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
                for (var i = this.curr_y; i !== this.next_y; i += (10 * this.original_slope)) {
                    if (Math.abs(i) > canvas.height) {
                        break;
                    }
                    if (this.original_slope === 1 && i > this.next_y) {
                        break;
                    }
                    else if (this.original_slope === -1 && i < this.next_y) {
                        break;
                    }
                    this.draw_food(this.curr_x, i);
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
 * The Ghost function in JavaScript defines a class for creating ghost objects with specified initial
 * and next positions, movement behavior, and drawing functionality.
 * @param x - The `x` parameter in the `Ghost` function represents the initial x-coordinate of the
 * ghost's position on the canvas. It determines where the ghost will be initially placed horizontally.
 * @param y - The `y` parameter in the `Ghost` function represents the initial y-coordinate of the
 * ghost on the canvas. It determines the vertical position of the ghost when it is first created.
 * @param next_x - Next_x is the x-coordinate of the next position where the Ghost object will move to.
 * @param next_y - Next_y is the y-coordinate of the next position where the Ghost object will move to.
 * It represents the vertical position where the Ghost will be heading towards in the game or
 * application.
 * @param image - The `image` parameter in the `Ghost` function represents the image that will be used
 * to draw the ghost object on the canvas. This image could be a reference to an image file or an image
 * object that contains the visual representation of the ghost character. When the `draw` method is
 * called for
 * @param size - The `size` parameter in the `Ghost` function represents the size of the ghost object.
 * It is used to determine the dimensions of the ghost when drawing it on the canvas. The `size`
 * parameter is typically the width and height of the ghost object, and it is used to position the
 * ghost
 * @returns The code you provided defines a constructor function called `Ghost` that creates objects
 * representing ghost entities in a game. The function initializes properties such as position, image,
 * size, and movement direction for each ghost object.
 * @namespace Ghost_complete
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
/**  The above JavaScript code defines a method `reduce_speed` that reduces the values of `dx` and
`slope` by dividing them by 2 in a loop. The loop continues as long as the value of `dx` is greater
than or equal to 0.0001 and the absolute value of `slope` is greater than or equal to 2. This code
is likely used to gradually decrease the speed and slope of an object in a simulation or game
scenario. 
* @memberof Ghost_complete 
*/
    this.reduce_speed = function () {
        while (this.dx >= 0.0001 && (this.slope >= 2 || this.slope <= -2)) {
            this.dx = this.dx / 2;
            this.slope = this.slope / 2;
        }
    }
    this.reduce_speed();
/**  The above JavaScript code defines a method `get_position` within an object. This method returns an
object with the current x and y coordinates of the object.
* @memberof Ghost_complete 
*/
    this.get_position = function () {
        return { x: this.x, y: this.y };
    }
/**  The above code is a JavaScript function that is used to draw an image on a canvas. It is commented
out, but it appears to have originally included code to draw two circles using the `arc` method, but
that code is currently disabled. The active part of the code uses the `drawImage` method to draw an
image at a specified position and size on the canvas. 
* @memberof Ghost_complete 
*/
    this.draw = function () {
        ctx.drawImage(this.image, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
    /**
     * The above code is a JavaScript function that appears to be updating the position of an object on a canvas. Here is a breakdown of what the code is doing:
     * @memberof Ghost_complete
     */
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
 * The `draw` function in JavaScript updates the canvas by drawing circles in different colors based on
 * lists of coordinates, with additional logic for handling ghost and pacman interactions.
 * @returns In the provided code snippet, the `draw` function is being called recursively using
 * `requestAnimationFrame`. The function contains various conditional statements and loops to update
 * and draw elements on a canvas.
 */
function draw() {
    req1 = requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (ghostList.length - list2.length >= 1) {
        ghostList.shift();
    }
    if (ghostList.length !== 0 && f === true) {
        var ghost_pos = ghostList[0].get_position();
        var pacman_pos = pacman.get_position();
        if (Math.abs(ghost_pos.x - pacman_pos.x) < 2 && Math.abs(ghost_pos.y - pacman_pos.y) < 2) {
            ghostList.reverse();
            ghostList.pop();
            ghostList.reverse();
        }
    }
    for (var i = 0; i < list2.length; i++) {
        ctx.beginPath();
        ctx.arc(list2[i].x, list2[i].y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
    }
    for (var i = 0; i < list1.length; i++) {
        ctx.beginPath();
        ctx.arc(list1[i].x, list1[i].y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();
    }
    for (var i = 0; i < ghostList.length; i++) {
        ghostList[i].update();
    }
    if (list1.length > 0) {
        pacman.update();
    }
    else if (list2.length === 0) {
        if (ghostList.length > 0) {
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
        console.log("list2 when equal ", list2);
        list1 = list2;
        console.log("list1 when equal ", list1);
        hull_list.push(list2[0]);
        pacman.image_open = p_open;
        pacman.image_close = p_close;
        for (var i = 0; i < ghostList.length; i++) {
            ghostList[i].image = afraid_g;
        }
        pacman.set_non_hull(list1);
    }
}

/**
 * The function `draw_in_next` in the JavaScript code handles the visualization of points, pairs, and
 * hulls in a convex hull algorithm, including drawing lines, arcs, and updating ghost objects based on
 * certain conditions.
 */
let colorList = [];

function draw_in_next() {
    req2 = requestAnimationFrame(draw_in_next);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
        var index = idx;
        const pts = myConvexHull[index].points;
        const pairs = myConvexHull[index].pairs;
        const state = myConvexHull[index].state;
        const slope = myConvexHull[index].slope;
        const noncandidates = myConvexHull[index].noncandidates;
        var next_index = index + 1;
    if (state !== 'lower_bridge' && state !== 'upper_bridge' && state !== 'upper_hull' && state !== 'lower_hull' && state !== 'hull' && pairs !== null && pairs.length === 2 && pairs[0].length !== 2) {
        ctx.beginPath();
        ctx.moveTo(pairs[0].x, pairs[0].y);
        ctx.lineTo(pairs[1].x, pairs[1].y);
        ctx.closePath();
        ctx.strokeStyle = 'red';
        ctx.stroke();
        text = "Step " + next_index + " calculation of " + state;
    }
    else if (state !== 'upper_bridge' && state !== 'upper_hull' && state !== 'lower_bridge' && state !== 'lower_hull' && state !== 'hull' && pairs !== null) {
        ctx.beginPath();
        ctx.moveTo(pairs[0][0].x, pairs[0][0].y);
        ctx.lineTo(pairs[0][1].x, pairs[0][1].y);
        for (let i = 1; i < pairs.length; i++) {
            ctx.moveTo(pairs[i][0].x, pairs[i][0].y);
            ctx.lineTo(pairs[i][1].x, pairs[i][1].y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'green';
        ctx.stroke();
        text = "Step " + next_index + " calculation of " + state;
    }
    else if (state === 'upper_bridge' || state === 'upper_hull' || state === 'lower_bridge' || state === 'lower_hull' || state === 'hull') {
        if (pairs !== null) {
            ctx.beginPath();
            ctx.moveTo(pairs[0].x, pairs[0].y);
            ctx.lineTo(pairs[1].x, pairs[1].y);
            for (let i = 1; i < pairs.length - 1; i++) {
                ctx.moveTo(pairs[i].x, pairs[i].y);
                ctx.lineTo(pairs[i + 1].x, pairs[i + 1].y);
            }
            ctx.closePath();
            ctx.strokeStyle = 'blue';
            ctx.stroke();
            text = "Step " + next_index + " calculation of " + state;
        }
    }

    if (state === 'upper_bridge' || state === 'lower_bridge') {
        if (pairs.length === 2 && flag3 === true) {
            // this is to avoid same index to be added again
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
                    ghostList_in_next.splice(i, 1);
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
            ghostList_in_next.push(new Ghost(pairs[0].x, pairs[0].y, pairs[1].x, pairs[1].y, myGhost, 20));
            colorList.push({color: randInt, curr_x: pairs[0].x, curr_y: pairs[0].y, next_x: pairs[1].x, next_y: pairs[1].y});
            flag3 = false;
        }

    }

    // display points
    if (pts !== null) {
        pts.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
            if (state === 'median_x') {
                if (point.x <= slope) {
                    ctx.fillStyle = 'blue';
                }
                else {
                    ctx.fillStyle = 'red';
                }
            }
            else {
                ctx.fillStyle = '#00ff00';
            }
            ctx.fill();
            ctx.closePath();
        });
    }
    if (noncandidates !== null) {
        noncandidates.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.fill();
            ctx.closePath();
        });
    }

    if (state === 'median_x') {
        text = "Step " + next_index + " the x median line partitions into 2 sets of points";
        if (slope !== null) {
            let slope_x = slope;
            ctx.beginPath();
            ctx.moveTo(slope_x, 0);
            ctx.lineTo(slope_x, 600);
            ctx.closePath();
            ctx.strokeStyle = 'yellow';
            ctx.stroke();
        }
    }

    if(state === 'median_slope')
    {
        text = "Step " + next_index + " the median slope of the pairs is calculated" ;
        if(slope !== null)
        {
            let myslope = slope;
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            ctx.lineTo(pts[0].x + 500, pts[0].y + myslope * 500);
            ctx.lineTo(pts[0].x - 500, pts[0].y - myslope * 500);
            ctx.closePath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'orange';
            ctx.stroke();
        }
    }

    if (state === 'hull') {
        // make lines of points
        audio_siren.pause();
        console.log("hull ... ");

        text = "Step " + next_index + "finally the upper hull is created ";

        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (var i = 0; i < pts.length - 1; i++) {
            ctx.lineTo(pts[i + 1].x, pts[i + 1].y);
        }
        ctx.lineTo(pts[0].x, pts[0].y);
        ctx.closePath();
        ctx.stroke();
        cancelAnimationFrame(req2);

        // done fore previous button
        hull_list = [];

        var hull = pts.slice();
        list2 = hull.slice();
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



/**
 * @classdesc Represents a Layer.
 * @class
 *
 * 
 * 
 */
class ConvexHull {
    constructor(points) {
        this.points = points;

        currentPoints = this.points;
    }
/**
* Finds the convex hull of a set of points.
*@method
 *@namespace findConvexHull
 */

    findConvexHull() {
        if (this.points.length <= 1) return this.points;

        // Sort points by x-coordinate
        this.points.sort((a, b) => a.x - b.x);
        console.log("points", this.points);
/**
 * 
 * The `removeDuplicates` function takes an array of objects and removes any duplicate objects based on
 * their `x` and `y` properties.
 * @memberof findConvexHull
 * @param arr - It looks like the code you provided is a function called `removeDuplicates` that takes
 * an array `arr` as a parameter. The function iterates over the array and removes any duplicate
 * elements based on the `x` and `y` properties of the objects in the array.
 * @returns{void} - The function modifies the input array in place by removing duplicate elements.
 */
        const removeDuplicates = (arr) => {
            console.log("arr before ", arr);
            for (var i = 0; i < arr.length; i++) {
                for (var j = i + 1; j < arr.length; j++) {
                    if (arr[i].x === arr[j].x && arr[i].y === arr[j].y) {
                        arr.splice(j, 1);
                        j--;
                    }
                }
            }
            console.log("arr after ", arr);
        }

        // Helper function to find the convex hull of a set of points
/**
 * The `findHull` function in JavaScript computes the convex hull of a set of points using a divide and
 * conquer algorithm.
 * @memberof findConvexHull
 * @param points - The `findHull` function you provided seems to be implementing the Convex Hull
 * algorithm. The algorithm computes the convex hull of a set of points using the Divide and Conquer
 * approach.
 * @returns The function `findHull` is returning the final convex hull of the input points after
 * performing the necessary computations and merging the upper and lower hulls.
 */

        const findHull = (points) => {

            console.log("I am in KPS");
            let pmin_u, pmin_l, pmax_u, pmax_l;

            pmin_l = pmin_u = pmax_l = pmax_u = points[0];
            for (let i = 1; i < points.length; i++) {
                let curr_point = points[i];
                if (points[i].x < pmin_l.x) {
                    pmin_l = points[i];
                    pmin_u = points[i];
                }
                else if (points[i].x > pmax_l.x) {
                    pmax_l = points[i];
                    pmax_u = points[i];
                }
                else if (points[i].x === pmin_l.x) {
                    if (points[i].y > pmin_u.y)
                        pmin_u = points[i];
                    else if (points[i].y < pmin_l.y)
                        pmin_l = points[i];
                }
                else if (points[i].x === pmax_l.x) {
                    if (points[i].y > pmax_u.y)
                        pmax_u = points[i];
                    else if (points[i].y < pmax_l.y)
                        pmax_l = points[i];
                }
            } // point initialization
            console.log("pmin_u", pmin_u);
            console.log("pmax_u", pmax_u);
            myConvexHull.push({ state: outputindex++, points: points, pairs: null, slope: null, state: 'initial_points', noncandidates: null });
            textBoxEle.push("This algorithm functions by separately computing the upper and lower hulls of our points. To obtain the complete convex hull, we can simply merge the upper and lower hulls.")
            myConvexHull.push({ state: outputindex++, points: points, pairs: [pmin_u, pmax_u], slope: null, state: 'pmiu_pmaxu', noncandidates: null });
            textBoxEle.push("Presently, let's concentrate on the lower portion of our points, specifically those positioned below the segment delineated by x_min and x_max.")
            let lower_T = get_T(pmin_u, pmax_u, points, false);

            let noncandidates = points.filter(pt => !lower_T.includes(pt));

            myConvexHull.push({ state: outputindex++, points: lower_T, pairs: null, slope: null, state: 'lower_T', noncandidates: noncandidates });
            textBoxEle.push('Now that we have the lower points we begin the computation of lower hull. This is a divide and conquer algorithm so we will divide our points into two sets based on median x value.')
            let lower_hull = get_lower_hull(pmin_u, pmax_u, lower_T);
            removeDuplicates(lower_hull);
            ////// Sort in increasing order of x

            lower_hull.sort((a, b) => {
                if (a.x < b.x) return -1;
                else if (a.x > b.x) return 1;
            });

            let upper_T = get_T(pmin_l, pmax_l, points, true);
            let upper_hull = get_upper_hull(pmin_l, pmax_l, upper_T);
            removeDuplicates(upper_hull);

            upper_hull.sort((a, b) => {
                if (a.x > b.x) return -1;
                else if (a.x < b.x) return 1;
            });
            ////// Sort in decreasing order of x

            let hull_edges = [];
            hull_edges = hull_edges.concat(upper_hull);
            hull_edges = hull_edges.concat(lower_hull);

            removeDuplicates(hull_edges);
            let hull = [];
            hull.push(hull_edges[0]);
            let i = 1;
            while (i < hull_edges.length) {
                if (i < hull_edges.length)
                    hull.push(hull_edges[i]);

                i++;
            }
            console.log("points", points);
            console.log("hull", hull);
            noncandidates = [];

            for (let i = 0; i < points.length; i++) {
                let isCandidate = true;
                for (let j = 0; j < hull.length; j++) {
                    if (Math.abs(hull[j].x - points[i].x) < 0.0001 && Math.abs(hull[j].y - points[i].y) < 0.0001) {
                        isCandidate = false;
                        break;
                    }
                }
                if (isCandidate) {
                    noncandidates.push(points[i]);
                }
            }
            console.log("non candidates ", noncandidates);
            myConvexHull.push({ state: outputindex++, points: hull, pairs: null, slope: null, state: 'hull', noncandidates: noncandidates });
            textBoxEle.push("Final Hull is displayed by merging lower and upper hull and displayed by neon-blue borders.")
            return hull;
        };
/**
 * The `findMedian` function takes an array of numbers, sorts it in ascending order, and returns the
 * median value.
 * @param arr - The `arr` parameter in the `findMedian` function is an array of numbers for which we
 * want to find the median. The function sorts the array in ascending order and then calculates the
 * median value.
 * @memberof findConvexHull
 * @returns The findMedian function is returning the median value of the input array after sorting it
 * in ascending order.
 */

        const findMedian = (arr) => {
            arr.sort((a, b) => a - b);
            return arr[Math.floor(arr.length / 2)];
        }

/**
 * @memberof findConvexHull
 * The `partition` function takes an array, a left index, a right index, and a pivot value, and
 * partitions the array such that elements less than or equal to the pivot are moved to the left side
 * of the array.
 * @param arr - The `arr` parameter in the `partition` function represents an array that you want to
 * partition. It contains the elements that you want to rearrange based on a specific pivot element
 * `x`.
 * @param l - The parameter `l` in the `partition` function represents the starting index of the
 * subarray within the array `arr` that you want to partition. It indicates the left boundary of the
 * subarray.
 * @param r - The parameter `r` in the `partition` function represents the index of the rightmost
 * element in the array segment being partitioned. It is used to determine the range within which the
 * partitioning operation should be performed.
 * @param x - The `x` parameter in the `partition` function represents the pivot element around which
 * the array `arr` will be partitioned. The function rearranges the elements in the array such that all
 * elements less than or equal to `x` are placed before `x`, and all elements greater than `
 * @returns The `partition` function is returning the index `i` where the element `x` is placed after
 * partitioning the array `arr` within the range from index `l` to index `r`.
 */
        const partition = (arr, l, r, x) => {
            let i;
            for (i = l; i < r; i++)
                if (arr[i] === x)
                    break;
            [arr[i], arr[r]] = [arr[r], arr[i]];

            i = l;
            for (let j = l; j <= r - 1; j++) {
                if (arr[j] <= x) {
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    i++;
                }
            }
            [arr[i], arr[r]] = [arr[r], arr[i]];
            return i;
        }

 /**
  * The function `kthSmallest` finds the kth smallest element in an array using the median of medians
  * algorithm.
  * @memberof findConvexHull
  * @param arr - The `arr` parameter in the `kthSmallest` function represents an array of elements from
  * which you want to find the kth smallest element.
  * @param l - The parameter `l` in the `kthSmallest` function represents the starting index of the
  * subarray within the main array `arr` that we are considering. It indicates the left boundary of the
  * subarray.
  * @param r - The parameter `r` in the `kthSmallest` function represents the index of the last element
  * in the array `arr`. It indicates the right boundary of the subarray being considered for finding
  * the kth smallest element.
  * @param k - The parameter `k` in the `kthSmallest` function represents the position of the element
  * you want to find in the sorted array. For example, if `k` is 1, you are looking for the smallest
  * element in the array. If `k` is 2, you
  * @returns The function `kthSmallest` is returning the kth smallest element in the given array `arr`
  * within the range specified by `l` and `r`. If the value of `k` is within the valid range (greater
  * than 0 and less than or equal to the size of the subarray), the function performs a series of
  * operations to find the kth smallest element using a
  */
        const kthSmallest = (arr, l, r, k) => {
            if (k > 0 && k <= r - l + 1) {
                let n = r - l + 1;
                let median = Array(Math.floor((n + 4) / 5)).fill(0); // this is a doubtable line
                let i;
                for (i = 0; i < Math.floor(n / 5); i++)
                    median[i] = findMedian(arr.slice(l + i * 5, l + i * 5 + 5));
                if (i * 5 < n) {
                    median[i] = findMedian(arr.slice(l + i * 5, l + i * 5 + n % 5));
                    i++;
                }

                let medOfMed = (i === 1) ? median[i - 1] : kthSmallest(median, 0, i - 1, Math.floor(i / 2));

                let pos = partition(arr, l, r, medOfMed);

                if (pos - l === k - 1)
                    return arr[pos];
                if (pos - l > k - 1)
                    return kthSmallest(arr, l, pos - 1, k);

                return kthSmallest(arr, pos + 1, r, k - pos + l - 1);
            }

            return Number.MAX_SAFE_INTEGER;
        }
/**
 * The function `get_T` calculates and returns a subset of points that lie between two given points
 * based on a specified condition.
 * @param p1 - It looks like you were about to provide some information about the parameters for the
 * `get_T` function. Please go ahead and provide the details for the `p1` parameter so that I can
 * assist you further.
 * @memberof findConvexHull
 * @param p2 - It seems like you were about to provide some information about the parameters, but you
 * stopped after mentioning `p2`. How can I assist you further with this code snippet?
 * @param points - It seems like you were about to provide some information about the `points`
 * parameter but it got cut off. Could you please provide more details or let me know how I can assist
 * you further with the `points` parameter in the `get_T` function?
 * @param flag - The `flag` parameter in the `get_T` function is used to determine whether to include
 * points with a slope greater than or less than the calculated slope in the `upper_T` array. If `flag`
 * is `false`, only points with a slope greater than the calculated slope will be included
 * @returns The function `get_T` is returning an array `upper_T` containing points that lie between
 * points `p1` and `p2` based on the slope comparison with the flag condition. The array `upper_T` also
 * includes points `p1` and `p2`.
 */

        const get_T = (p1, p2, points, flag) => {
            let upper_T = [];
            let slope = (p1.y - p2.y) / (p1.x - p2.x);

            for (let i = 0; i < points.length; i++) {
                let curr_point = points[i];

                if (curr_point.x > p1.x && curr_point.x < p2.x) {
                    let curr_slope = (p1.y - curr_point.y) / (p1.x - curr_point.x);

                    if (!flag) {
                        if (curr_slope > slope) upper_T.push(curr_point);
                    } else {
                        if (curr_slope < slope) upper_T.push(curr_point);
                    }
                }
            }

            upper_T.push(p1);
            upper_T.push(p2);
            return upper_T;
        }

/**
 * The function `get_lower_bridge` in JavaScript sorts points, calculates median slope, and recursively
 * finds the lower bridge of a set of points based on the median.
 * @param points - The `points` parameter in the `get_lower_bridge` function represents an array of
 * points on a 2D plane. Each point is represented as an object with `x` and `y` coordinates. The
 * function sorts these points based on their `x` values and then performs calculations to find
 * @param median - The `get_lower_bridge` function you provided seems to be calculating the lower
 * bridge of a set of points based on a given median value. However, it looks like the description of
 * the `median` parameter is missing. Could you please provide more information about what the `median`
 * parameter represents in this
 * @returns The function `get_lower_bridge` is returning the lower bridge points based on the input
 * points and median value. It recursively calls itself to find the lower hull points and eventually
 * returns the lower bridge points.
 * @memberof findConvexHull
 */
        const get_lower_bridge = (points, median) => {
            points.sort((a, b) => a.x < b.x ? -1 : 1);

            console.log("points upper bridge", points);
            if (points.length === 1) {
                return [points[0], points[0]];
            }
            let candidates = [];
            let pairs = [];
            if (points.length % 2 === 0) {
                for (let i = 0; i < points.length; i += 2) {
                    let first_pt = points[i];
                    let second_pt = points[i];
                    if (i + 1 !== points.length) {
                        second_pt = points[i + 1];
                    }
                    let curr_pair = [first_pt, second_pt];
                    pairs.push(curr_pair);
                }
            }
            else {
                candidates.push(points[0]);
                for (let i = 1; i < points.length; i += 2) {
                    let first_pt = points[i];
                    let second_pt = points[i];
                    if (i + 1 !== points.length) {
                        second_pt = points[i + 1];
                    }

                    let curr_pair = [first_pt, second_pt];
                    pairs.push(curr_pair);
                }
            }

            myConvexHull.push({ state: outputindex++, points: points, pairs: pairs, median_slope: null, state: 'pairs', noncandidates: null });
            textBoxEle.push("If we say your ideal edge has slope of k. We can try out different slopes and see this is they form bridge edge. Let's start drawing random edges between our points.")

            let slopes_len = pairs.length;
            let slopes = [];
            for (let i = 0; i < pairs.length; i++) {
                let p1 = pairs[i][0];
                let p2 = pairs[i][1];
                let x1 = p1.x;
                let x2 = p2.x;
                let y1 = p1.y;
                let y2 = p2.y;
                if (x1 === x2) {
                    if (y1 > y2) {
                        candidates.push(p1);
                    }
                    else {
                        candidates.push(p2);
                    }
                    slopes[i] = Infinity;
                }
                else {
                    let slope = (y2 - y1) / (x2 - x1);
                    slopes[i] = slope;
                }
            }
            let arr = [];
            let len = 0;
            for (let i = 0; i < slopes_len; i++) {
                if (slopes[i] !== Infinity) {
                    arr[len++] = slopes[i];
                }
            } 
            let median_slope;
            if (len === 1)
                median_slope = arr[0];
            else
                median_slope = kthSmallest(arr, 0, len - 1, Math.floor((len + 1) / 2));

            myConvexHull.push({ state: outputindex++, points: points, pairs: pairs, slope: median_slope, state: 'median_slope', noncandidates: null });
            textBoxEle.push("Now that we have the median slope of the pairs let's see if the median slope is the slope of the bridge edge. To test we can sweep this line vertically. Based on this sweep we can determine if we have found k.")
            let SMALL = [];
            let EQUAL = [];
            let LARGE = [];
            for (let i = 0; i < pairs.length; i++) {
                let p1 = pairs[i][0];
                let p2 = pairs[i][1];
                let x1 = p1.x;
                let x2 = p2.x;
                let y1 = p1.y;
                let y2 = p2.y;

                if (x1 !== x2) {
                    let slope = (y2 - y1) / (x2 - x1);
                    if (slope === median_slope) {
                        let curr_pair = [p1, p2];
                        EQUAL.push(curr_pair);
                    }
                    else if (slope < median_slope) {
                        let curr_pair = [p1, p2];
                        SMALL.push(curr_pair);
                    }
                    else if (slope > median_slope) {
                        let curr_pair = [p1, p2];
                        LARGE.push(curr_pair);
                    }
                }
            }
            let max_c = -Infinity;
            for (let i = 0; i < points.length; i++) {

                let x = points[i].x;
                let y = points[i].y;
                let curr_c = y - median_slope * x;

                if (curr_c > max_c) {
                    max_c = curr_c;
                }

            }

            let pmin = { x: Infinity, y: Infinity };
            let pmax = { x: -Infinity, y: -Infinity };
            for (let i = 0; i < points.length; i++) {

                let x = points[i].x;
                let y = points[i].y;

                let curr_c = y - median_slope * x;

                if (Math.abs(curr_c - max_c) < 0.001) {

                    if (x < pmin.x) {
                        pmin = { x: x, y: y };
                    }
                    if (x > pmax.x) {
                        pmax = { x: x, y: y };
                    }
                }
            }
            if (pmin.x <= median && pmax.x > median) {
                let upper_bridge = [pmin, pmax];
                return upper_bridge;
            }
            else if (pmax.x <= median) {
                for (let i = 0; i < EQUAL.length; i++) {
                    let pt = EQUAL[i][1];
                    candidates.push(pt);
                }
                for (let i = 0; i < LARGE.length; i++) {
                    let pt = LARGE[i][1];
                    candidates.push(pt);
                }
                for (let i = 0; i < SMALL.length; i++) {
                    let pt1 = SMALL[i][0];
                    let pt2 = SMALL[i][1];
                    candidates.push(pt1);
                    candidates.push(pt2);
                }
            }
            else if (pmin.x > median) {
                for (let i = 0; i < EQUAL.length; i++) {
                    let pt = EQUAL[i][0];
                    candidates.push(pt);
                }
                for (let i = 0; i < LARGE.length; i++) {
                    let pt1 = LARGE[i][0];
                    let pt2 = LARGE[i][1];
                    candidates.push(pt1);
                    candidates.push(pt2);
                }
                for (let i = 0; i < SMALL.length; i++) {
                    let pt = SMALL[i][0];
                    candidates.push(pt);
                }
            }
            let noncandidates = [];
            for (let i = 0; i < points.length; i++) {
                let isCandidate = true;
                for (let j = 0; j < candidates.length; j++) {
                    if (Math.abs(candidates[j][0] - points[i].x) < 0.0001 && Math.abs(candidates[j][1] - points[i].y) < 0.0001) {
                        isCandidate = false;
                        break;
                    }
                }
                if (isCandidate) {
                    noncandidates.push(points[i]);
                }
            }
            myConvexHull.push({ state: outputindex++, points: candidates, pairs: null, slope: null, state: 'points-removal', noncandidates: null });
            textBoxEle.push("We remove the non hull points by using median slope and corollary of lemma2 + lemma 3 and then recursively calling function on remaining points to find lower hull.")
            return get_lower_bridge(candidates, median);
        }
     /**
      * The function `get_upper_bridge` in JavaScript sorts points, calculates median slope, and
      * recursively finds the upper hull of a set of points.
      * @param points - The `points` parameter in the `get_upper_bridge` function represents an array
      * of points on a 2D plane. Each point is represented as an object with `x` and `y` coordinates.
      * The function is designed to find the upper bridge of these points based on a given median value
      * @param median - The code snippet you provided seems to be a function for finding the upper
      * bridge in a set of points based on a given median value. The function recursively narrows down
      * the points to find the upper bridge.
      * @returns The function `get_upper_bridge` is returning the result of recursively calling itself
      * with the `candidates` array and the `median` value. This recursive call is used to find the
      * upper bridge of the given set of points. The function continues to remove non-hull points based
      * on the median slope and certain conditions until it finds the upper bridge.
      * @memberof findConvexHull
      */
        const get_upper_bridge = (points, median) => {
            points.sort((a, b) => a.x < b.x ? -1 : 1);
            console.log("Points lower bridge", points);
            if (points.length === 1) {
                return [points[0], points[0]];
            }
            let candidates = [];
            let pairs = [];

            if (points.length % 2 === 0) {
                for (let i = 0; i < points.length; i += 2) {
                    let first_pt = points[i];
                    let second_pt = points[i];
                    if (i + 1 !== points.length) {
                        second_pt = points[i + 1];
                    }
                    let curr_pair = [first_pt, second_pt];
                    pairs.push(curr_pair);
                }
            }
            else {
                candidates.push(points[0]);
                for (let i = 1; i < points.length; i += 2) {
                    let first_pt = points[i];
                    let second_pt = points[i];
                    if (i + 1 !== points.length) {
                        second_pt = points[i + 1];
                    }

                    let curr_pair = [first_pt, second_pt];
                    pairs.push(curr_pair);
                }
            }
            myConvexHull.push({ state: outputindex++, points: points, pairs: pairs, median_slope: null, state: 'pairs', noncandidates: null });
            textBoxEle.push("If we say your ideal edge has slope of k. We can try out different slopes and see this is they form bridge edge. Let's start start drawing random edges between our points.")


            let slopes_len = pairs.length;
            let slopes = [];
            for (let i = 0; i < pairs.length; i++) {
                let p1 = pairs[i][0];
                let p2 = pairs[i][1];
                let x1 = p1.x;
                let x2 = p2.x;
                let y1 = p1.y;
                let y2 = p2.y;

                if (x1 === x2) {
                    if (y1 > y2) {
                        candidates.push(p2);
                    } else {
                        candidates.push(p1);
                    }
                    slopes[i] = Infinity;
                }
                else {
                    let slope = (y2 - y1) / (x2 - x1);
                    slopes[i] = slope;
                }
            }
            let arr = [];
            let len = 0;
            for (let i = 0; i < slopes_len; i++) {
                if (slopes[i] !== Infinity) {
                    arr[len++] = slopes[i];
                }
            }

            let median_slope;
            if (len === 1)
                median_slope = arr[0];
            else
                median_slope = kthSmallest(arr, 0, len - 1, Math.floor((len + 1) / 2));
            myConvexHull.push({ state: outputindex++, points: points, pairs: pairs, slope: median_slope, state: 'median_slope', noncandidates: null });
            textBoxEle.push("Now that we have the median slope of the pairs let's see if the median slope is the slope of the bridge edge. To test we can sweep this line vertically. Based on this sweep we can determine if we have found k.")

            let SMALL = [];
            let EQUAL = [];
            let LARGE = [];
            for (let i = 0; i < pairs.length; i++) {
                let p1 = pairs[i][0];
                let p2 = pairs[i][1];
                let x1 = p1.x;
                let x2 = p2.x;
                let y1 = p1.y;
                let y2 = p2.y;
                if (x1 !== x2) {
                    let slope = (y2 - y1) / (x2 - x1);
                    if (slope === median_slope) {
                        let curr_pair = [p1, p2];
                        EQUAL.push(curr_pair);
                    }
                    else if (slope < median_slope) {
                        let curr_pair = [p1, p2];
                        SMALL.push(curr_pair);
                    }
                    else if (slope > median_slope) {
                        let curr_pair = [p1, p2];
                        LARGE.push(curr_pair);
                    }
                }
            }
            let min_c = Infinity;

            for (let i = 0; i < points.length; i++) {
                let x = points[i].x;
                let y = points[i].y;
                let curr_c = y - median_slope * x;
                if (curr_c < min_c) {
                    min_c = curr_c;
                }
            }
            let pmin = { x: Infinity, y: Infinity };
            let pmax = { x: -Infinity, y: -Infinity };
            for (let i = 0; i < points.length; i++) {
                let x = points[i].x;
                let y = points[i].y;
                let curr_c = y - median_slope * x;
                if (Math.abs(curr_c - min_c) < 0.001) {
                    if (x < pmin.x) {
                        pmin = { x: x, y: y };
                    }
                    if (x > pmax.x) {
                        pmax = { x: x, y: y };
                    }
                }
            }
            console.log("pmin : ", pmin);
            console.log("pmax : ", pmax);
            console.log("median : ", median);
            if (pmin.x <= median && pmax.x > median) {
                let lower_bridge = [pmin, pmax];
                return lower_bridge;
            }
            else if (pmax.x <= median) {
                for (let i = 0; i < EQUAL.length; i++) {
                    let pt = EQUAL[i][1];
                    candidates.push(pt);
                }
                for (let i = 0; i < LARGE.length; i++) {
                    let pt1 = LARGE[i][0];
                    let pt2 = LARGE[i][1];
                    candidates.push(pt1);
                    candidates.push(pt2);
                }
                for (let i = 0; i < SMALL.length; i++) {
                    let pt = SMALL[i][1];
                    candidates.push(pt);
                }
            }
            else if (pmin.x > median) {
                for (let i = 0; i < EQUAL.length; i++) {
                    let pt = EQUAL[i][0];
                    candidates.push(pt);
                }
                for (let i = 0; i < LARGE.length; i++) {
                    let pt = LARGE[i][0];
                    candidates.push(pt);
                }
                for (let i = 0; i < SMALL.length; i++) {
                    let pt1 = SMALL[i][0];
                    let pt2 = SMALL[i][1];
                    candidates.push(pt1);
                    candidates.push(pt2);
                }
            }
            let noncandidates = [];
            for (let i = 0; i < points.length; i++) {
                let isCandidate = true;
                for (let j = 0; j < candidates.length; j++) {
                    if (Math.abs(candidates[j][0] - points[i].x) < 0.0001 && Math.abs(candidates[j][1] - points[i].y) < 0.0001) {
                        isCandidate = false;
                        break;
                    }
                }
                if (isCandidate) {
                    noncandidates.push(points[i]);
                }
            }
            myConvexHull.push({ state: outputindex++, points: candidates, pairs: null, slope: null, state: 'points-removal', noncandidates: null });
            textBoxEle.push("We remove the non hull points by using median slope and corollary of lemma2 + lemma 3 and then recursively calling function on remaining points to find upper hull.")

          
            return get_upper_bridge(candidates, median);
        }
      /**
       * The function `get_lower_hull` calculates the lower hull of a set of points using the divide
       * and conquer approach in computational geometry.
       * @param pmin - It seems like you have shared a part of a code snippet for computing the lower
       * hull in a convex hull algorithm. However, you have not provided the complete context or the
       * definition of some functions like `kthSmallest`, `get_lower_bridge`, and `get_T`.
       * @param pmax - It seems like the code snippet you provided is a part of a larger algorithm for
       * computing the convex hull of a set of points. The `get_lower_hull` function is responsible for
       * finding the lower hull of the points based on the given parameters.
       * @param points - It seems like the code snippet you provided is part of a larger algorithm for
       * computing the convex hull of a set of points. The `get_lower_hull` function is responsible for
       * finding the lower hull of the points based on certain conditions.
       * @returns The function `get_lower_hull` is returning the lower hull of a set of points. It
       * recursively computes the lower hull by finding the bridge edge, splitting the points into left
       * and right sets, and then recursively calling itself on the left and right sides of the bridge
       * edge. The final result is the lower hull of the input points.
       * @memberof findConvexHull
       */
        const get_lower_hull = (pmin, pmax, points) => {
            // // console.log("get upper hull starts");
            let lower_hull = [];
            let n = points.length;
            let arr = [];
            for (let i = 0; i < n; i++) {
                arr[i] = points[i].x;
            }

            let median;
            if (n === 1) {
                median = arr[0];
            }
            else {
                median = kthSmallest(arr, 0, n - 1, Math.floor((n + 1) / 2));
            }

            myConvexHull.push({ state: outputindex++, points: points, pairs: null, slope: median, state: 'median_x', noncandidates: null });
            textBoxEle.push('With two sets being formed. We can find the bridge edge by connecting one hull point from left side to another hull point on the right side. The bridge edge will be part of our convex hull and it will merge our divided sets.')
            const lower_bridge = get_lower_bridge(points, median);

            myConvexHull.push({ state: outputindex++, points: points, pairs: lower_bridge, slope: null, state: 'lower_bridge', noncandidates: null });
            textBoxEle.push('We have found the bridge edge. Now recursively call the function on the left and right side of the bridge edge.')
            let pl = lower_bridge[0];
            let pr = lower_bridge[1];

            if (pl.x > pr.x) {
                let temp = pl;
                pl = pr;
                pr = temp;
            } 
            lower_hull.push(pl);
            lower_hull.push(pr);

            if (pmin.x !== pl.x || pmin.y !== pl.y) 
            {
                let lower_T_left = get_T(pmin, pl, points, false);
                let left = get_lower_hull(pmin, pl, lower_T_left);
                lower_hull = lower_hull.concat(left);
            }

            if (pmax.x !== pr.x || pmax.y !== pr.y) {
                let lower_T_right = get_T(pr, pmax, points, false);
                let right = get_lower_hull(pr, pmax, lower_T_right);
                lower_hull = lower_hull.concat(right);
            }
            myConvexHull.push({ state: outputindex++, points: points, pairs: lower_hull, slope: null, state: 'lower_hull', noncandidates: null });
            textBoxEle.push('We have found the lower hull. Now we can compute the remaining lower hull if the lower hull is done move on to compute upper hull.')
            return lower_hull;
        }

       /**
        * The function `get_upper_hull` calculates the upper hull of a set of points using the divide
        * and conquer algorithm for finding the convex hull.
        * @param pmin - The `pmin` parameter in the `get_upper_hull` function represents the minimum
        * point on the x-axis among the input points. It is used to determine the starting point for
        * constructing the upper hull of the convex hull.
        * @param pmax - It seems like the description of the `pmax` parameter is missing in the
        * provided code snippet. Could you please provide more information or context about what `pmax`
        * represents in this function? This will help me assist you better in understanding the code.
        * @param points - It seems like the description of the `points` parameter is missing in your
        * code snippet. Could you please provide more information about what the `points` parameter
        * represents in your `get_upper_hull` function? This will help me better understand the context
        * and provide you with more accurate assistance.
        * @returns The function `get_upper_hull` returns the upper hull of a set of points after
        * performing certain calculations and recursive calls.
        * @memberof findConvexHull
        */
        const get_upper_hull = (pmin, pmax, points) => {
            let upper_hull = [];
            let n = points.length;
            let arr = [];
            for (let i = 0; i < n; i++) {
                arr[i] = points[i].x;
            }
            let median = n === 1 ? arr[0] : kthSmallest(arr, 0, n - 1, Math.floor((n + 1) / 2));
            myConvexHull.push({ state: outputindex++, points: points, pairs: null, slope: median, state: 'median_x', noncandidates: null });
            textBoxEle.push('With two sets being formed. We can find the bridge edge by connecting one hull point from left side to another hull point on the right side. The bridge edge will be part of our convex hull and it will merge our divided sets.')

            let upper_bridge = get_upper_bridge(points, median);
            let pl = upper_bridge[0];
            let pr = upper_bridge[1];


            myConvexHull.push({ state: outputindex++, points: points, pairs: upper_bridge, slope: null, state: 'lower_bridge', noncandidates: null });
            textBoxEle.push('We have found the bridge edge. Now recursively call the function on the left and right side of the bridge edge.')

            if (pl.x > pr.x) {
                let temp = pl;
                pl = pr;
                pr = temp;
            }

            upper_hull.push(pl);
            upper_hull.push(pr);

            if (pmin.x !== pl.x || pmin.y !== pl.y) {
                let upper_T_left = get_T(pmin, pl, points, true);
                let left = get_upper_hull(pmin, pl, upper_T_left);
                upper_hull = upper_hull.concat(left);
            }
            if (pmax.x !== pr.x || pmax.y !== pr.y) {
                let upper_T_right = get_T(pr, pmax, points, true);
                let right = get_upper_hull(pr, pmax, upper_T_right);
                upper_hull = upper_hull.concat(right);
            }
            myConvexHull.push({ state: outputindex++, points: points, pairs: upper_hull, slope: null, state: 'upper_hull', noncandidates: null });
            textBoxEle.push('We have found the upper hull. Now we can compute the complete hull.')


            return upper_hull;
        }


        // Helper function to determine orientatio

        // Divide points into upper and lower halves
        const hull = findHull(this.points);

        // Merge upper and lower hulls
        return hull;
    }
/**
 * The function calculates the orientation of three points in a 2D plane.
 * @param p1 - The `p1`, `p2`, and `p3` parameters in the `orientation` function represent points in a
 * 2D plane. Each point has an `x` and `y` coordinate.
 * @param p2 - It seems like you were about to provide more information about the parameters. Could you
 * please provide the details for p1 and p3 as well so that I can assist you better?
 * @param p3 - The `orientation` function you provided seems to be calculating the orientation of three
 * points in a plane. The parameters `p1`, `p2`, and `p3` represent these points.
 * @returns The `orientation` function is returning the orientation of three points `p1`, `p2`, and
 * `p3`. It calculates the cross product of vectors formed by the points to determine if they are
 * clockwise, counterclockwise, or collinear. The return value is the result of the cross product
 * calculation.
 */

    orientation(p1, p2, p3) {
        return (p2.y - p1.y) * (p3.x - p2.x) - (p2.x - p1.x) * (p3.y - p2.y);
    }
}

/**
 *  
 * The Canvas component in the JavaScript code allows users to interactively draw points on a canvas,
 * visualize a convex hull algorithm, navigate through steps, and control the process using keyboard
 * shortcuts.
 * @namespace Canvasvar
 * @returns The `Canvas` component is being returned. It contains a canvas element with various event
 * handlers and functions to interact with the canvas, draw points, draw convex hull, handle mouse
 * movements, add points, finish drawing, clear canvas, navigate through steps, and display steps in a
 * text area. The component also includes buttons for navigation and interaction with the canvas.
 */


const Canvas = () => {
    // Assuming canvas is your canvas element
    const canvasRef = useRef(null);
    const [finished, setFinished] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [textBoxValue, setTextBoxValue] = useState('');
    const [pointsInput, setPointsInput] = useState('');
    var [randomNo, setRandomInput] = useState('');
    var [points, setPoints] = useState([]);
    var [val, setVal] = useState(0);
    const keysPressed = useRef({});
    const [hoverCoordinates, setHoverCoordinates] = useState({ x: 0, y: 0 });
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
            let audiofin = new Audio(eatGhostAudio);
            audiofin.play();
        }

        // Draw points
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#00ff00';
            ctx.fill();
        });

    }, [points, finished]);

/**
 * The function `handleAddPoint` takes input coordinates, validates them, adds them to a points array,
 * plays a sound, and alerts the user if the input is invalid.
 * @memberof Canvasvar
 */
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

/**
 * The function `handleCanvasClick` adds a new point to the canvas at the location where the user
 * clicked and plays a sound effect.
 * @param event - The `event` parameter in the `handleCanvasClick` function represents the mouse click
 * event that triggers the function. It contains information about the click event such as the
 * coordinates of the mouse pointer at the time of the click.
 * @memberof Canvasvar
 */

    const handleCanvasClick = (event) => {
        if (!finished) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            x = Math.floor(x);
            y = Math.floor(y);
            setPoints(prevPoints => [...prevPoints, { x, y }]);
            let audio = new Audio(point_added);
            audio.currentTime = 0.2;
            audio.play();
        }
    };

/**
 * The `handleFinishClick` function sets a state to true and plays an audio file in a loop with a
 * delay.
 * @memberof Canvasvar
 */
const handleFinishClick = () => {
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

/**
 * The `delay` function in JavaScript returns a promise that resolves after a specified amount of time.
 * @param ms - The `ms` parameter in the `delay` function represents the number of milliseconds to wait
 * before resolving the promise. This is the amount of time the function will delay before completing
 * its execution.
 * @returns A Promise object is being returned.
 * @memberof Canvasvar
 */
    const delay = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

/**
 * The handleSkip function iterates through elements in an array and calls another function while
 * waiting for a specified delay between iterations
 * @memberof Canvasvar.
 */
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
/**
 * The function `handlePointsInputChange` updates the state with the value of an input field.
 * @param e - The parameter `e` in the `handlePointsInputChange` function is an event object that
 * represents the event being triggered, such as a change event on an input field. It contains
 * information about the event, including the target element that triggered the event (in this case, an
 * input field) and the
 * @memberof Canvasvar
 */
    const handlePointsInputChange = (e) => {
        setPointsInput(e.target.value);
      };

    const handleRandomSize = (e) => {
        setRandomInput(e.target.value);
    }

/**
 * The `clearCanvas` function clears the canvas, plays a death sound, and resets the game state.
 * @memberof Canvasvar
 */
    const clearCanvas = () => {
        setPoints([]);
        let audio = new Audio(pacmna_death);
        audio.play();
        setFinished(false);
    };

/**
 * The `handleNext` function increments the index value, sets the new index, clears the canvas, plays
 * an audio, cancels any previous animation frame request, and requests a new animation frame to draw
 * the convex hull if the process is finished.
 * @memberof Canvasvar
 */
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

        while(myConvexHull[index].state === 'upper_hull' && myConvexHull[index + 1].state === 'upper_hull') {
            index++;
            setVal(index);
        }

        while(myConvexHull[index].state === 'lower_hull' && myConvexHull[index + 1].state === 'lower_hull') {
            index++;
            setVal(index);
        }

        if(myConvexHull[index].state === 'hull') {
            done = true;
        }
        
        
        // Draw convex hull
        if (finished) {
            let audio = new Audio(state_change);
            audio.play();

            if (req2 != null) {
                cancelAnimationFrame(req2);
            }
            flag3 = true;
            idx = index;
            setTextBoxValue(textBoxEle[index]);
            req2 = requestAnimationFrame(draw_in_next);
        }
    };

    

 /**
  * The handlePrev function updates the index value, clears the canvas, plays an audio file, cancels
  * animation frame if necessary, and requests a new animation frame.
  * @memberof Canvasvar
  */
    const handlePrev = () => {
        var index = val > 0 ? val - 1 : 0;
        done = false;
        done2 = false;
        setVal(index);
        console.log(index);
        console.log(myConvexHull[index]);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        while(myConvexHull[index].state === 'upper_hull' && myConvexHull[index - 1].state === 'upper_hull') {
            index--;
            setVal(index);
        }

        while(myConvexHull[index].state === 'lower_hull' && myConvexHull[index - 1].state === 'lower_hull') {
            index--;
            setVal(index);
        }

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
                else if(event.key === 'b') {
                    let itr = val;
                    for(let i = itr + 1; i < myConvexHull.length; i++) {
                        handleNext();
                        val++;
                        if(myConvexHull[i].state === 'upper_bridge' || myConvexHull[i].state === 'lower_bridge') {
                            break;
                        }
                    }
                }
                else if(event.key === 'u') {
                    let itr = val;
                    let maxi;
                    for(let i = itr; i < myConvexHull.length; i++) {
                        if(myConvexHull[i].state === 'upper_hull') {
                            maxi = i;
                        }
                    }
                    for(let j = itr; j < maxi; j++)
                    {
                        handleNext();
                        val++;
                    }
                }
                else if(event.key === 'l') {
                    let itr = val;
                    let maxi;
                    for(let i = itr; i < myConvexHull.length; i++) {
                        if(myConvexHull[i].state === 'lower_hull') {
                            maxi = i;
                        }
                    }
                    for(let j = itr; j < maxi; j++)
                    {
                        handleNext();
                        val++;
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
            <h1 className='kpstext'> KPS </h1>
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
                    rows={7}
                    cols={50}
                />
            </div>
        </div>
    );
};


/* The above code is defining a JavaScript class named `Canvas` and exporting it as the default export.
The class is likely intended to be used for working with HTML canvas elements in a web application. */
export default Canvas;
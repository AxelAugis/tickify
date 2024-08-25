<?php 

namespace App\Config;

enum TicketStatus: string
{
    case TODO = 'todo';
    case IN_PROGRESS = 'in_progress';
    case DONE = 'done';
    case CLOSED = 'closed';
}
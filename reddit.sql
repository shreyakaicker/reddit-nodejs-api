-- This creates the users table. The username field is constrained to unique
-- values only, by using a UNIQUE KEY on that column
CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(60) NOT NULL, -- why 60??? ask me :)
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- This creates the posts table. The userId column references the id column of
-- users. If a user is deleted, the corresponding posts' userIds will be set NULL.
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(300) DEFAULT NULL,
  `url` varchar(2000) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL, 
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- create table reddit        
CREATE TABLE `subreddits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `createdAt` TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `comments` (
  `id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `text` VARCHAR(10000),
  `createdAt` TIMESTAMP,
  `updatedAt` TIMESTAMP,
  `userId` int(11) NOT NULL,
  `parentId` int(11) DEFAULT NULL,
  `postId` int(11) NOT NULL
);

CREATE TABLE `votes` (
  `userId` int(11),
  `postId` int(11),
  PRIMARY KEY (userId, postId),
  `vote` tinyint(3),
  `createdAt` TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP NOT NULL,
  FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  FOREIGN KEY (`postId`) REFERENCES `posts` (`id`)
)




-- this is what we added in my sql
alter table posts add column subredditId int, ADD FOREIGN KEY (subredditId) REFERENCES subreddits(id);

INSERT into subreddits (name,description) VALUES ("Shreya","strawberry");

alter table comments ADD FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
alter table comments ADD FOREIGN KEY (`postId`) REFERENCES `posts` (`id`);
alter table comments ADD FOREIGN KEY (`parentId`) REFERENCES `comments`(`id`);
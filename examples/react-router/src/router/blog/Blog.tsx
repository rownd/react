import './Blog.scss';
import React from 'react';

const Blog: React.FC = () => {
  return (
    <div className="blog">
      <div className="blog__title">Blog</div>
      <button className="blog__button">Button</button>
      <div className="blog__subtitle">
        Behind the Scenes: Crafting Our Innovative Sample App
      </div>
      <div className="blog__content">
        At Rownd, we're excited to share the journey of creating our latest
        sample app that showcases the power of modern technology and
        user-centric design. From concept to execution, our team poured passion
        and expertise into every step of the development process. Here's a
        glimpse into how we built this innovative app:
        <br />
        <br />
        <ol type="1">
          <li>
            Idea Generation and Conceptualization: Our journey began with
            brainstorming sessions and idea generation. We identified a need in
            the market and conceptualized a solution that would revolutionize
            how users interact with [specific industry/sector].
          </li>
          <li>
            Design and Wireframing: Next, our talented designers crafted
            wireframes and prototypes to visualize the app's user interface and
            experience. We focused on intuitive navigation, sleek aesthetics,
            and seamless interactions to deliver a delightful user journey.
          </li>
          <li>
            Development and Coding: Our developers worked tirelessly to bring
            the design concepts to life. Using cutting-edge technologies such as
            [specific technology stack or framework], we coded robust features,
            integrated APIs, and ensured scalability for future enhancements.
          </li>
          <li>
            Testing and Quality Assurance: Quality is at the core of everything
            we do. Our QA team rigorously tested the app, conducted user
            acceptance testing (UAT), and addressed any bugs or issues to
            guarantee a flawless user experience.
          </li>
          <li>
            Deployment and Launch: With thorough testing completed, we prepared
            for the app's deployment and launch. We optimized performance,
            finalized branding elements, and crafted compelling marketing
            materials to promote the app's debut.
          </li>
          <li>
            User Feedback and Iteration: Post-launch, we actively sought user
            feedback and iterated based on valuable insights. Continuous
            improvement and user-centric updates are key pillars of our
            development philosophy.
          </li>
          <li>
            Future Roadmap and Innovation: Our journey doesn't end with the
            launch. We're committed to ongoing innovation, feature enhancements,
            and staying ahead of industry trends to ensure our app remains a
            game-changer in the [specific industry/sector]. Stay tuned for more
            updates, tips, and insights from our team as we continue to innovate
            and empower users through technology. Thank you for joining us on
            this exciting journey!
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Blog;

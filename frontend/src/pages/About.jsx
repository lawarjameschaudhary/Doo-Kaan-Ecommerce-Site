import { Target, Eye, Users } from 'lucide-react';

const TEAM = [
  { name: 'Sudip Shrestha', role: 'Founder & CEO', image: "https://scontent.fktm23-1.fna.fbcdn.net/v/t51.75761-15/482514549_17866463562340590_107937371588343404_n.webp?stp=dst-jpg_tt6&cstp=mx1440x1440&ctp=s1440x1440&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=zvsxwkDSPj0Q7kNvwGam_5u&_nc_oc=AdrgZCTUk-TxUWWxmK5zvXcFaHbn3YpCz_WH-htXZP8985-A7gRxXy0mqJa9Ue5s4LM4FRMuIzs5gQI5sTTLHKot&_nc_zt=23&_nc_ht=scontent.fktm23-1.fna&_nc_gid=Ox447vIcfpzfOmBRPPXRNg&_nc_ss=7b2a8&oh=00_AQAhF3voTYn45kYZQd1EuZc1EdXvKGxWj_rrL-xikQrnOQ&oe=6A4E7A8D", },
  { name: 'Sugam Regmi', role: 'Head of Operations', image: "https://scontent.fktm23-1.fna.fbcdn.net/v/t39.30808-6/616224939_1586992599177186_7737177456845005391_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx2048x2048&ctp=s2048x2048&_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=tPfGMnXTXd8Q7kNvwH3yItq&_nc_oc=Adou4hdPv6Bm9YiuNbg8e1p8JlbIQyHp1WFAjh1_ggy0sdD-zSJEh3kUeauy0NFUdqw99rvOifp2cTnL2ZwBRQ0z&_nc_zt=23&_nc_ht=scontent.fktm23-1.fna&_nc_gid=XHvQrjWNp13S2kwGCLOmjw&_nc_ss=7b2a8&oh=00_AQCzQXuTBailFqoePDji0JKwuFNGj_h5dtcfUkkOVBsUUQ&oe=6A4E95D3", },
  { name: 'Sugam Regmi', role: 'Lead Engineer', image: "https://scontent.fktm23-1.fna.fbcdn.net/v/t39.30808-6/616224939_1586992599177186_7737177456845005391_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx2048x2048&ctp=s2048x2048&_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=tPfGMnXTXd8Q7kNvwH3yItq&_nc_oc=Adou4hdPv6Bm9YiuNbg8e1p8JlbIQyHp1WFAjh1_ggy0sdD-zSJEh3kUeauy0NFUdqw99rvOifp2cTnL2ZwBRQ0z&_nc_zt=23&_nc_ht=scontent.fktm23-1.fna&_nc_gid=XHvQrjWNp13S2kwGCLOmjw&_nc_ss=7b2a8&oh=00_AQCzQXuTBailFqoePDji0JKwuFNGj_h5dtcfUkkOVBsUUQ&oe=6A4E95D3", },
  { name: 'Lawar James Chaudhary', role: 'Customer Success', image: "https://scontent.fktm23-1.fna.fbcdn.net/v/t39.30808-6/605501407_1507443210330113_8615895907315797209_n.jpg?stp=dst-jpg_tt6&cstp=mx1024x1029&ctp=s1024x1029&_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=OIG-K-op6LwQ7kNvwFP0rnA&_nc_oc=Adobx2lzqOzphBajlFBhaZxVFnms9_DGcfOKOPPBjKYDlt4nsy_C_FSXt15iJrPbfuQRpJ8QKjdqj3Crrc4PSdjT&_nc_zt=23&_nc_ht=scontent.fktm23-1.fna&_nc_gid=xcOS3a5ILBFGqGydZlgZVw&_nc_ss=7b2a8&oh=00_AQB7ZK0KKM4ywK1xxCWwPjIbCJ6_UXUw_xLL0lqb4dV3rw&oe=6A4E95C5", },
];

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="section-title mb-2">About Doo-Kaan</h1>
        <p className="text-gray-500 dark:text-gray-400">Everything you need, in one place.</p>
      </div>

      <div className="card p-8 mb-10">
        <h2 className="text-xl font-bold mb-3">Our Story</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Doo-Kaan began as a simple idea: online shopping should be effortless, affordable, and enjoyable.
          What started as a small catalog of everyday essentials has grown into a marketplace spanning
          electronics, fashion, home goods, and more — all built around a single promise of quality and
          convenience for every customer.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <div className="card p-6">
          <Target className="text-primary mb-3" size={28} />
          <h3 className="font-bold mb-2">Our Mission</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            To make quality products accessible to everyone through a seamless, trustworthy, and enjoyable
            online shopping experience.
          </p>
        </div>
        <div className="card p-6">
          <Eye className="text-primary mb-3" size={28} />
          <h3 className="font-bold mb-2">Our Vision</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            To become the most trusted and customer-loved eCommerce destination, connecting shoppers with
            the products they love.
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 justify-center mb-6">
          <Users className="text-primary" size={22} />
          <h2 className="text-xl font-bold">Meet the Team</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TEAM.map((member) => (
            <div key={member.name} className="card p-5 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg mx-auto mb-3">
                <img
                src={member.image}
                alt={member.name}
                className="w-15 h-15 rounded-full object-cover"
                />
              </div>
              <p className="font-semibold text-sm">{member.name}</p>
              <p className="text-xs text-gray-400">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

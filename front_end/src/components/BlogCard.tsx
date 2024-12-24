import React from 'react';
const BlogCard = ({ item, index, goToSinglePage,page }) => {
    function formatMongoDBDate(timestamp) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const suffix = (day % 10 === 1 && day !== 11) ? 'st' :
            (day % 10 === 2 && day !== 12) ? 'nd' :
                (day % 10 === 3 && day !== 13) ? 'rd' : 'th';
        return `${day}${suffix}-${month}-${year}`;
    }
    return (
        <div key={item._id}>
            <div className="p-[1rem] text-left flex flex-col rounded-xl bg-white">
                <div className="flex justify-start blogWrapper gap-4">
                    <div>
                        <img
                            className="rounded-xl blogImg"
                            width="70px"
                            src={item.author.profilePicture}
                            alt=""
                        />
                    </div>
                    <div className="flex flex-col justify-end">
                        <div>
                            <h1 className="text-black font-semibold text-lg">{item.title}</h1>
                        </div>
                        <div className="text-[#6C757D] mb-[3px] font-medium flex gap-2">
                            <h1 className="blogTime">
                                {item.name}
                                <span> {formatMongoDBDate(item.createdAt)}</span>
                            </h1>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-[#6C757D]">{item.description}</p>
                </div>
                {page === "home" && <div className="mt-3">
                    <p
                        onClick={() => goToSinglePage(index)}
                        id="seeAll"
                        className="text-[#7749f8] cursor-pointer font-semibold"
                    >
                        <span>see all from this user</span>
                    </p>
                </div>}
            </div>
        </div>
    )
}

export default BlogCard
